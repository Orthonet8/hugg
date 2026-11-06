<?php

namespace App\Filament\Resources\SupportTickets\Pages;

use App\Filament\Resources\SupportTickets\SupportTicketResource;
use App\Models\SupportMessage;
use App\Models\SupportTicket;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Livewire\WithFileUploads;

class SupportChatPage extends Page implements HasForms
{
    use InteractsWithForms;
    use WithFileUploads;

    protected static string $resource = SupportTicketResource::class;

    protected string $view = 'filament.resources.support-tickets.chat-page';

    public int|string $record;

    public ?SupportTicket $ticket = null;

    public ?string $reply_message = '';

    public mixed $attachment = null;

    public ?string $update_status = null;

    public function mount(int|string $record): void
    {
        $this->record = $record;
        $this->loadTicket();
    }

    public function loadTicket(): void
    {
        $this->ticket = SupportTicket::with(['member', 'assignedUser', 'messages' => fn ($q) => $q->oldest()])->findOrFail($this->record);
        $this->update_status = $this->ticket->status;
    }

    public function getTitle(): string
    {
        return $this->ticket ? "Chat #{$this->ticket->id}: {$this->ticket->subject}" : 'Support Ticket Chat';
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('back')
                ->label('Back to Tickets')
                ->icon(Heroicon::OutlinedArrowLeft)
                ->color('gray')
                ->url(SupportTicketResource::getUrl('index')),
        ];
    }

    public function sendMessage(): void
    {
        $replyText = trim((string) $this->reply_message);
        $user = auth('internal')->user();

        if (empty($replyText) && empty($this->attachment)) {
            if ($this->update_status && $this->update_status !== $this->ticket->status) {
                $this->ticket->update(['status' => $this->update_status]);
                Notification::make()->title('Status updated')->success()->send();
                $this->loadTicket();
            }
            return;
        }

        $attachmentPath = null;
        $attachmentType = null;
        $attachmentName = null;

        if ($this->attachment) {
            $attachmentName = method_exists($this->attachment, 'getClientOriginalName')
                ? $this->attachment->getClientOriginalName()
                : 'attachment';
            $ext = strtolower(pathinfo($attachmentName, PATHINFO_EXTENSION));

            $attachmentPath = $this->attachment->store('support_attachments', 'public');

            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                $attachmentType = 'image';
            } elseif (in_array($ext, ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'opus', 'webm'])) {
                $attachmentType = 'audio';
            } elseif (in_array($ext, ['mp4', 'mov', 'webm', 'mkv'])) {
                $attachmentType = 'video';
            } else {
                $attachmentType = 'file';
            }
        }

        SupportMessage::create([
            'ticket_id'       => $this->ticket->id,
            'sender_type'     => 'user',
            'sender_id'       => $user?->id,
            'message'         => $replyText ?: null,
            'attachment_url'  => $attachmentPath,
            'attachment_type' => $attachmentType,
            'attachment_name' => $attachmentName,
            'is_read'         => false,
        ]);

        $updates = [
            'last_message_at' => now(),
            'status'          => $this->update_status ?: 'in_progress',
        ];

        if (! $this->ticket->assigned_user_id && $user) {
            $updates['assigned_user_id'] = $user->id;
        }

        $this->ticket->update($updates);

        $this->reset(['reply_message', 'attachment']);
        $this->loadTicket();

        Notification::make()
            ->title('Message sent')
            ->success()
            ->send();
    }

    public function setStatus(string $status): void
    {
        $this->ticket->update(['status' => $status]);
        $this->update_status = $status;
        $this->loadTicket();

        Notification::make()->title('Ticket status: ' . ucfirst($status))->success()->send();
    }
}
