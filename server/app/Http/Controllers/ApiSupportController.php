<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ApiSupportController extends Controller
{
    /**
     * Authenticate member using Bearer token.
     */
    protected function authenticateMember(Request $request): ?Member
    {
        $token = $request->header('Authorization');
        if (! $token || ! str_starts_with($token, 'Bearer ')) {
            return null;
        }

        $token = substr($token, 7);
        $parts = explode(':', $token, 2);
        if (count($parts) !== 2) {
            return null;
        }

        $username = $parts[0];

        return Member::active()
            ->whereRaw('LOWER(email_or_username) = ?', [mb_strtolower($username)])
            ->first();
    }

    /**
     * GET /api/support/supporters
     * List all available supporters and who to contact by sector.
     */
    public function supporters(Request $request): JsonResponse
    {
        $sector = $request->query('sector');

        $query = User::query()
            ->where(function ($q) {
                $q->where('is_supporter', true)
                  ->orWhereHas('roles', fn ($r) => $r->where('name', 'admin'));
            });

        if ($sector) {
            $query->whereJsonContains('support_sectors', $sector);
        }

        $supporters = $query->get()->map(function (User $user) {
            $avatar = $user->avatar_url ? asset('storage/' . $user->avatar_url) : $user->getFilamentAvatarUrl();

            return [
                'id'                => $user->id,
                'name'              => $user->name,
                'photo'             => $avatar,
                'phone'             => $user->phone,
                'telegram_username' => $user->telegram_username ? ltrim($user->telegram_username, '@') : null,
                'email'             => $user->email,
                'support_sectors'   => $user->support_sectors ?? [],
                'support_bio'       => $user->support_bio,
            ];
        });

        return response()->json([
            'supporters' => $supporters,
        ]);
    }

    /**
     * GET /api/support/tickets
     * List tickets created by the logged-in member.
     */
    public function tickets(Request $request): JsonResponse
    {
        $member = $this->authenticateMember($request);
        if (! $member) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $tickets = SupportTicket::query()
            ->where('member_id', $member->id)
            ->with(['assignedUser', 'latestMessage'])
            ->latest('updated_at')
            ->get()
            ->map(fn (SupportTicket $t) => $this->formatTicket($t));

        return response()->json([
            'tickets' => $tickets,
        ]);
    }

    /**
     * POST /api/support/tickets
     * Create a new support ticket and send initial message/attachment.
     */
    public function createTicket(Request $request): JsonResponse
    {
        $member = $this->authenticateMember($request);
        if (! $member) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'subject'          => 'required|string|max:255',
            'sector'           => 'required|string',
            'message'          => 'nullable|string',
            'assigned_user_id' => 'nullable|exists:users,id',
            'attachment'       => 'nullable|file|max:20480', // 20MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        // Auto-match supporter if none specifically selected
        $assignedUserId = $validated['assigned_user_id'] ?? null;
        if (! $assignedUserId) {
            $assignedUserId = User::query()
                ->where('is_supporter', true)
                ->whereJsonContains('support_sectors', $validated['sector'])
                ->inRandomOrder()
                ->value('id');
        }

        $ticket = SupportTicket::create([
            'member_id'        => $member->id,
            'assigned_user_id' => $assignedUserId,
            'subject'          => $validated['subject'],
            'sector'           => $validated['sector'],
            'status'           => 'open',
            'priority'         => 'medium',
            'last_message_at'  => now(),
        ]);

        // Process message or attachment
        $attachmentUrl = null;
        $attachmentType = null;
        $attachmentName = null;

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('support_attachments', 'public');
            $attachmentUrl = $path;
            $attachmentName = $file->getClientOriginalName();
            $mime = $file->getMimeType();

            $nameLower = strtolower($attachmentName);
            if (str_starts_with($mime, 'image/')) {
                $attachmentType = 'image';
            } elseif (str_starts_with($mime, 'audio/') || str_contains($nameLower, 'voice_note') || preg_match('/\.(opus|ogg|mp3|wav|m4a|aac)$/i', $nameLower)) {
                $attachmentType = 'audio';
            } elseif (str_starts_with($mime, 'video/')) {
                // If it's a webm created without video tracks (audio recorder), treat as audio
                if (str_contains($nameLower, 'voice_note') || str_ends_with($nameLower, '.webm')) {
                    $attachmentType = 'audio';
                } else {
                    $attachmentType = 'video';
                }
            } else {
                $attachmentType = 'file';
            }
        }

        if (! empty($validated['message']) || $attachmentUrl) {
            SupportMessage::create([
                'ticket_id'       => $ticket->id,
                'sender_type'     => 'member',
                'sender_id'       => $member->id,
                'message'         => $validated['message'] ?? null,
                'attachment_url'  => $attachmentUrl,
                'attachment_type' => $attachmentType,
                'attachment_name' => $attachmentName,
            ]);
        }

        return response()->json([
            'message' => 'Support request submitted successfully',
            'ticket'  => $this->formatTicket($ticket->fresh(['assignedUser', 'messages'])),
        ], 201);
    }

    /**
     * GET /api/support/tickets/{id}
     * Get ticket details with chat messages.
     */
    public function showTicket(Request $request, int $id): JsonResponse
    {
        $member = $this->authenticateMember($request);
        if (! $member) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $ticket = SupportTicket::query()
            ->where('id', $id)
            ->where('member_id', $member->id)
            ->with(['assignedUser', 'messages'])
            ->firstOrFail();

        return response()->json([
            'ticket' => $this->formatTicket($ticket),
        ]);
    }

    /**
     * POST /api/support/tickets/{id}/messages
     * Send a new message / voice note / short video / photo in an existing ticket.
     */
    public function sendMessage(Request $request, int $id): JsonResponse
    {
        $member = $this->authenticateMember($request);
        if (! $member) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $ticket = SupportTicket::query()
            ->where('id', $id)
            ->where('member_id', $member->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'message'    => 'nullable|string',
            'attachment' => 'nullable|file|max:20480',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $attachmentUrl = null;
        $attachmentType = null;
        $attachmentName = null;

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('support_attachments', 'public');
            $attachmentUrl = $path;
            $attachmentName = $file->getClientOriginalName();
            $mime = $file->getMimeType();

            $nameLower = strtolower($attachmentName);
            if (str_starts_with($mime, 'image/')) {
                $attachmentType = 'image';
            } elseif (str_starts_with($mime, 'audio/') || str_contains($nameLower, 'voice_note') || preg_match('/\.(opus|ogg|mp3|wav|m4a|aac)$/i', $nameLower)) {
                $attachmentType = 'audio';
            } elseif (str_starts_with($mime, 'video/')) {
                // If it's a webm created without video tracks (audio recorder), treat as audio
                if (str_contains($nameLower, 'voice_note') || str_ends_with($nameLower, '.webm')) {
                    $attachmentType = 'audio';
                } else {
                    $attachmentType = 'video';
                }
            } else {
                $attachmentType = 'file';
            }
        }

        if (empty($validated['message']) && ! $attachmentUrl) {
            return response()->json(['message' => 'Message or attachment required'], 422);
        }

        $message = SupportMessage::create([
            'ticket_id'       => $ticket->id,
            'sender_type'     => 'member',
            'sender_id'       => $member->id,
            'message'         => $validated['message'] ?? null,
            'attachment_url'  => $attachmentUrl,
            'attachment_type' => $attachmentType,
            'attachment_name' => $attachmentName,
        ]);

        $ticket->update([
            'last_message_at' => now(),
            'status'          => $ticket->status === 'resolved' || $ticket->status === 'closed' ? 'in_progress' : $ticket->status,
        ]);

        return response()->json([
            'message'       => 'Sent successfully',
            'chat_message'  => $this->formatMessage($message),
        ]);
    }

    protected function formatTicket(SupportTicket $ticket): array
    {
        return [
            'id'              => $ticket->id,
            'subject'         => $ticket->subject,
            'sector'          => $ticket->sector,
            'status'          => $ticket->status,
            'priority'        => $ticket->priority,
            'created_at'      => $ticket->created_at?->toIso8601String(),
            'last_message_at' => $ticket->last_message_at?->toIso8601String(),
            'supporter'       => $ticket->assignedUser ? [
                'id'                => $ticket->assignedUser->id,
                'name'              => $ticket->assignedUser->name,
                'photo'             => $ticket->assignedUser->avatar_url ? asset('storage/' . $ticket->assignedUser->avatar_url) : $ticket->assignedUser->getFilamentAvatarUrl(),
                'phone'             => $ticket->assignedUser->phone,
                'telegram_username' => $ticket->assignedUser->telegram_username ? ltrim($ticket->assignedUser->telegram_username, '@') : null,
            ] : null,
            'messages'        => $ticket->relationLoaded('messages')
                ? $ticket->messages->map(fn (SupportMessage $m) => $this->formatMessage($m))
                : [],
        ];
    }

    protected function formatMessage(SupportMessage $message): array
    {
        return [
            'id'              => $message->id,
            'sender_type'     => $message->sender_type,
            'message'         => $message->message,
            'attachment_url'  => $message->attachment_url ? asset('storage/' . $message->attachment_url) : null,
            'attachment_type' => $message->attachment_type,
            'attachment_name' => $message->attachment_name,
            'created_at'      => $message->created_at?->toIso8601String(),
        ];
    }
}
