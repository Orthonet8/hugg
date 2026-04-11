<?php

namespace App\Http\Controllers;

use App\Models\Family;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class ApiMemberController extends Controller
{
    /* ------------------------------------------------------------------ */
    /*  POST /api/auth/register */
    /* ------------------------------------------------------------------ */

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'christian_name' => 'nullable|string|max:255',
            'email_or_username' => 'required|string|unique:members,email_or_username|max:255',
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'mobile' => 'nullable|string|max:50|unique:members,mobile',
            'batch' => 'nullable|string|max:50',
            'gender' => 'nullable|in:ወንድ,ሴት',
            'age' => 'nullable|string|max:10',
            'profile_photo' => 'nullable|string|max:255',
            'campus' => 'nullable|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'dorm' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'zone' => 'nullable|string|max:255',
            'woreda' => 'nullable|string|max:255',
            'native_language' => 'nullable|string|max:255',
            'extra_languages' => 'nullable|string|max:255',
            'previous_participation' => 'nullable|string|max:255',
            'local_church' => 'nullable|string|max:255',
            'ordination' => 'nullable|string|max:255',
            'ordination_year' => 'nullable|string|max:255',
            'diocese' => 'nullable|string|max:255',
            'bishop' => 'nullable|string|max:255',
            'service_departments' => 'nullable|array',
            'talents' => 'nullable|array',
            'talent_description' => 'nullable|string|max:1000',
            'telegram' => 'nullable|string|max:255|unique:members,telegram',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        // Handle profile photo upload (file or URL string)
        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('avatars/members', 'public');
            $validated['profile_photo'] = $path;
        } elseif (isset($validated['profile_photo']) && filter_var($validated['profile_photo'], FILTER_VALIDATE_URL)) {
            // If a URL is passed, store it as-is (external avatar)
            $validated['profile_photo'] = $validated['profile_photo'];
        }

        $member = Member::create([
            ...$validated,
            'batch' => $validated['batch'] ?? '2018',
            'password' => Hash::make($validated['password']),
        ]);

        // Generate a simple token (in production, use Laravel Sanctum)
        $token = $member->email_or_username.':'.bin2hex(random_bytes(16));

        return response()->json([
            'message' => 'Registration successful',
            'member' => $this->formatMemberResponse($member),
            'token' => $token,
        ], 201);
    }

    public function checkIdentifier(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email_or_username' => 'nullable|string|max:255',
            'mobile' => 'nullable|string|max:50',
            'telegram' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $identifier = trim((string) ($validated['email_or_username'] ?? ''));
        $mobile = trim((string) ($validated['mobile'] ?? ''));
        $telegram = trim((string) ($validated['telegram'] ?? ''));

        if ($identifier === '' && $mobile === '' && $telegram === '') {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => [
                    'email_or_username' => ['At least one of email_or_username, mobile, or telegram is required.'],
                ],
            ], 422);
        }

        $identifierExists = false;
        $mobileExists = false;
        $telegramExists = false;

        if ($identifier !== '') {
            $identifierExists = Member::query()
                ->whereRaw('LOWER(email_or_username) = ?', [mb_strtolower($identifier)])
                ->exists();
        }

        if ($mobile !== '') {
            $mobileExists = Member::query()
                ->where('mobile', $mobile)
                ->exists();
        }

        if ($telegram !== '') {
            $telegramExists = Member::query()
                ->whereRaw('LOWER(telegram) = ?', [mb_strtolower($telegram)])
                ->exists();
        }

        return response()->json([
            // Backward compatibility for existing frontend logic.
            'exists' => $identifier !== ''
                ? $identifierExists
                : ($mobile !== '' ? $mobileExists : $telegramExists),
            'available' => $identifier !== ''
                ? ! $identifierExists
                : ($mobile !== '' ? ! $mobileExists : ! $telegramExists),
            'identifier_exists' => $identifierExists,
            'identifier_available' => ! $identifierExists,
            'mobile_exists' => $mobileExists,
            'mobile_available' => ! $mobileExists,
            'telegram_exists' => $telegramExists,
            'telegram_available' => ! $telegramExists,
        ]);
    }

    /* ------------------------------------------------------------------ */
    /*  POST /api/auth/login */
    /* ------------------------------------------------------------------ */

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email_or_username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $identifier = 'login:' . $validated['email_or_username'];
        $attempts = (int) Cache::get($identifier, 0);
        $maxAttempts = 3;

        // If locked out
        if ($attempts >= $maxAttempts) {
            $lockedUntil = Cache::get($identifier . ':locked_until');
            if ($lockedUntil && $lockedUntil > now()->timestamp) {
                $minutesRemaining = ceil(($lockedUntil - now()->timestamp) / 60);
                return response()->json([
                    'message' => "Too many failed attempts. Please try again in {$minutesRemaining} minute(s).",
                    'retryAfter' => $lockedUntil,
                ], 429);
            }
            Cache::forget($identifier);
            Cache::forget($identifier . ':locked_until');
            $attempts = 0;
        }

        $member = Member::where('email_or_username', $validated['email_or_username'])->first();

        $isDeactivated = $member && $member->is_active === false;

        // Failed credential check (invalid password OR deactivated account)
        if (! $member || ! Hash::check($validated['password'], $member->password) || $isDeactivated) {
            $attempts++;

            if ($attempts >= $maxAttempts) {
                $lockedUntil = now()->addMinutes(60)->timestamp;
                Cache::put($identifier, $attempts, now()->addMinutes(60));
                Cache::put($identifier . ':locked_until', $lockedUntil, now()->addMinutes(60));

                $msg = $isDeactivated
                    ? 'Account is deactivated. 3 failed attempts reached. Locked for 60 minutes.'
                    : 'Too many failed attempts. Your account is locked for 60 minutes.';

                return response()->json([
                    'message' => $msg,
                    'retryAfter' => $lockedUntil,
                ], 429);
            }

            Cache::put($identifier, $attempts, now()->addMinutes(60));

            $remaining = $maxAttempts - $attempts;

            if ($isDeactivated) {
                return response()->json([
                    'message' => "Your account is deactivated. {$remaining} attempt(s) remaining before lockout.",
                ], 403);
            }

            return response()->json([
                'message' => "Invalid credentials. {$remaining} attempt(s) remaining before lockout.",
            ], 401);
        }

        // Successful login — reset attempts
        Cache::forget($identifier);
        Cache::forget($identifier . ':locked_until');

        $token = $member->email_or_username.':'.bin2hex(random_bytes(16));

        return response()->json([
            'message' => 'Login successful',
            'member'  => $this->formatMemberResponse($member),
            'token'   => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        // In production, invalidate Sanctum token here
        return response()->json(['message' => 'Logged out successfully']);
    }

    /* ------------------------------------------------------------------ */
    /*  GET /api/auth/me */
    /* ------------------------------------------------------------------ */

    public function me(Request $request): JsonResponse
    {
        $member = $this->authenticateRequest($request);
        if (! $member) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json(['member' => $this->formatMemberResponse($member)]);
    }


    /* ------------------------------------------------------------------ */
    /*  PATCH /api/members/{id}/profile                                   */
    /* ------------------------------------------------------------------ */

    public function updateProfile(Request $request, int $id): JsonResponse
    {
        $member = Member::find($id);

        if (! $member) {
            return response()->json(["message" => "Member not found"], 404);
        }

        $validated = $request->validate([
            "christian_name"       => "nullable|string|max:255",
            "gender"               => "nullable|in:ወንድ,ሴት",
            "age"                  => "nullable|string|max:10",
            "campus"               => "nullable|string|max:255",
            "field_of_study"       => "nullable|string|max:255",
            "dorm"                 => "nullable|string|max:255",
            "region"               => "nullable|string|max:255",
            "zone"                 => "nullable|string|max:255",
            "woreda"               => "nullable|string|max:255",
            "native_language"      => "nullable|string|max:255",
            "extra_languages"      => "nullable|string|max:255",
            "previous_participation" => "nullable|string|max:255",
            "local_church"         => "nullable|string|max:255",
            "ordination"           => "nullable|string|max:255",
            "ordination_year"      => "nullable|string|max:255",
            "diocese"              => "nullable|string|max:255",
            "bishop"               => "nullable|string|max:255",
            "service_departments"  => "nullable|array",
            "talents"              => "nullable|array",
            "talent_description"   => "nullable|string|max:1000",
            "mobile"               => "nullable|string|max:50|unique:members,mobile,{$id}",
            "telegram"             => "nullable|string|max:255|unique:members,telegram,{$id}",
        ]);

        $member->update($validated);

        return response()->json([
            "message" => "Profile updated",
            "member"  => $this->formatMemberResponse($member),
        ]);
    }
    /* ------------------------------------------------------------------ */
    /*  GET /api/members */
    /* ------------------------------------------------------------------ */

    public function index(Request $request): JsonResponse
    {
        $query = Member::with('section')->active();

        if ($search = $request->query('search')) {
            $query->search($search);
        }

        if ($sectionId = $request->query('section_id')) {
            $query->where('section_id', $sectionId);
        }

        $members = $query
            ->orderBy('full_name')
            ->paginate($request->query('per_page', 20));

        return response()->json([
            'data' => $members->getCollection()->map(fn ($m) => $this->formatMemberResponse($m)),
            'meta' => [
                'current_page' => $members->currentPage(),
                'last_page' => $members->lastPage(),
                'per_page' => $members->perPage(),
                'total' => $members->total(),
            ],
        ]);
    }

    /* ------------------------------------------------------------------ */
    /*  GET /api/members/{id} */
    /* ------------------------------------------------------------------ */

    public function show(int $id): JsonResponse
    {
        $member = Member::with('section')->find($id);

        if (! $member) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        return response()->json(['member' => $this->formatMemberResponse($member)]);
    }

    /* ------------------------------------------------------------------ */
    /*  PATCH /api/members/{id} */
    /* ------------------------------------------------------------------ */

    public function update(Request $request, int $id): JsonResponse
    {
        $member = Member::find($id);

        if (! $member) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        $validated = $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'christian_name' => 'nullable|string|max:255',
            'username' => 'sometimes|string|unique:members,username,'.$id.'|max:255',
            'password' => ['sometimes', 'confirmed', Password::defaults()],
            'email_or_username' => 'nullable|string|max:255',
            'mobile' => 'nullable|string|max:50',
            'gender' => 'nullable|in:ወንድ,ሴት',
            'age' => 'nullable|string|max:10',
            'campus' => 'nullable|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'dorm' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'zone' => 'nullable|string|max:255',
            'woreda' => 'nullable|string|max:255',
            'native_language' => 'nullable|string|max:255',
            'extra_languages' => 'nullable|string|max:255',
            'previous_participation' => 'nullable|string|max:255',
            'local_church' => 'nullable|string|max:255',
            'ordination' => 'nullable|string|max:255',
            'ordination_year' => 'nullable|string|max:255',
            'diocese' => 'nullable|string|max:255',
            'bishop' => 'nullable|string|max:255',
            'service_departments' => 'nullable|array',
            'talents' => 'nullable|array',
            'talent_description' => 'nullable|string|max:1000',
            'telegram' => 'nullable|string|max:255',
            'section_id' => 'nullable|exists:sections,id',
            'is_active' => 'sometimes|boolean',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        // Handle profile photo upload
        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('avatars/members', 'public');
            $validated['profile_photo'] = $path;
        }

        $member->update($validated);

        return response()->json([
            'message' => 'Member updated',
            'member' => $this->formatMemberResponse($member),
        ]);
    }

    /* ------------------------------------------------------------------ */
    /*  DELETE /api/members/{id} */
    /* ------------------------------------------------------------------ */

    public function destroy(int $id): JsonResponse
    {
        $member = Member::find($id);

        if (! $member) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        // Soft-delete by deactivating
        $member->update(['is_active' => false]);

        // Or hard delete:
        // $member->delete();

        return response()->json(['message' => 'Member deleted']);
    }

    /* ------------------------------------------------------------------ */
    /*  GET /api/families */
    /* ------------------------------------------------------------------ */

    public function familiesIndex(): JsonResponse
    {
        $families = Family::with([])->orderBy('family_name')->get();

        return response()->json([
            'data' => $families->map(fn ($f) => $this->formatFamilyResponse($f)),
        ]);
    }

    /* ------------------------------------------------------------------ */
    /*  GET /api/families/{id} */
    /* ------------------------------------------------------------------ */

    public function familiesShow(int $id): JsonResponse
    {
        $family = Family::find($id);

        if (! $family) {
            return response()->json(['message' => 'Family not found'], 404);
        }

        return response()->json(['family' => $this->formatFamilyResponse($family)]);
    }

    /* ------------------------------------------------------------------ */
    /*  Helpers */
    /* ------------------------------------------------------------------ */

    /**
     * Format family data for API response.
     */
    protected function formatFamilyResponse(Family $family): array
    {
        $members = collect($family->members_data ?? [])
            ->map(function ($entry) {
                $member = Member::find($entry['member_id'] ?? null);
                if (! $member) {
                    return null;
                }

                $photoUrl = null;
                if ($member->profile_photo) {
                    $photoUrl = filter_var($member->profile_photo, FILTER_VALIDATE_URL)
                        ? $member->profile_photo
                        : asset('storage/'.$member->profile_photo);
                }

                return [
                    'id' => $member->id,
                    'fullName' => $member->full_name,
                    'role' => $entry['role'] ?? 'unknown',
                    'avatar' => $photoUrl ?? '',
                    'email' => $member->email_or_username ?? '',
                    'phone' => $member->mobile ?? '',
                ];
            })
            ->filter()
            ->values();

        $father = $members->firstWhere('role', 'father');
        $mother = $members->firstWhere('role', 'mother');
        $children = $members->filter(fn ($m) => $m['role'] === 'child')->values();

        return [
            'id' => $family->id,
            'familyName' => $family->family_name,
            'members' => $members,
            'father' => $father,
            'mother' => $mother,
            'children' => $children,
            'memberCount' => $members->count(),
            'createdAt' => $family->created_at?->toISOString(),
        ];
    }

    /**
     * Format member data for API response (matching React UserProfile type).
     */
    protected function formatMemberResponse(Member $member): array
    {
        $photoUrl = null;
        if ($member->profile_photo) {
            // If it's an absolute URL (external), use as-is
            if (filter_var($member->profile_photo, FILTER_VALIDATE_URL)) {
                $photoUrl = $member->profile_photo;
            } else {
                // Local file — generate public URL via storage symlink
                $photoUrl = asset('storage/'.$member->profile_photo);
            }
        }

        return [
            'id' => $member->id,
            'fullName' => $member->full_name,
            'christianName' => $member->christian_name,
            'emailOrUsername' => $member->email_or_username,
            'gender' => $member->gender,
            'age' => $member->age,
            'campus' => $member->campus,
            'dorm' => $member->dorm,
            'languages' => array_filter(array_merge(
                $member->native_language ? [$member->native_language] : [],
                $member->extra_languages ? explode(',', $member->extra_languages) : [],
            )),
            'talents' => $member->talents ?? [],
            'services' => $member->service_departments ?? [],
            'avatar' => $photoUrl ?? '',
            'email' => $member->email_or_username ?? '',
            'phone' => $member->mobile ?? '',
            'telegram' => $member->telegram ?? '',
            'sectionId' => $member->section_id,
            'section' => $member->section ? [
                'id' => $member->section->id,
                'name' => $member->section->display_name,
            ] : null,
            'isActive' => $member->is_active,
            'donationAccounts' => [],  // Future feature
            'region' => $member->region,
            'zone' => $member->zone,
            'woreda' => $member->woreda,
            'fieldOfStudy' => $member->field_of_study,
            'previousParticipation' => $member->previous_participation,
            'localChurch' => $member->local_church,
            'ordination' => $member->ordination,
            'ordinationYear' => $member->ordination_year,
            'diocese' => $member->diocese,
            'bishop' => $member->bishop,
            'talentDescription' => $member->talent_description,
            'createdAt' => $member->created_at?->toISOString(),
        ];
    }

    /**
     * Simple token-based auth for API (replace with Sanctum in production).
     */
    protected function authenticateRequest(Request $request): ?Member
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

        return Member::active()->where('email_or_username', $username)->first();
    }
}
