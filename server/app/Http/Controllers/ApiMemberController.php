<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ApiMemberController extends Controller
{
    /* ------------------------------------------------------------------ */
    /*  POST /api/auth/register                                           */
    /* ------------------------------------------------------------------ */

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name'      => 'required|string|max:255',
            'christian_name' => 'nullable|string|max:255',
            'email_or_username' => 'required|string|unique:members,email_or_username|max:255',
            'password'       => ['required', 'confirmed', Password::defaults()],
            'mobile'         => 'nullable|string|max:50',
            'gender'         => 'nullable|in:ወንድ,ሴት',
            'age'            => 'nullable|string|max:10',
            'profile_photo'  => 'nullable|string|max:255',
            'campus'         => 'nullable|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'dorm'           => 'nullable|string|max:255',
            'region'         => 'nullable|string|max:255',
            'zone'           => 'nullable|string|max:255',
            'woreda'         => 'nullable|string|max:255',
            'native_language'  => 'nullable|string|max:255',
            'extra_languages'  => 'nullable|string|max:255',
            'previous_participation' => 'nullable|string|max:255',
            'local_church'   => 'nullable|string|max:255',
            'ordination'     => 'nullable|string|max:255',
            'ordination_year' => 'nullable|string|max:255',
            'diocese'        => 'nullable|string|max:255',
            'bishop'         => 'nullable|string|max:255',
            'service_departments' => 'nullable|array',
            'talents'        => 'nullable|array',
            'talent_description' => 'nullable|string|max:1000',
            'telegram'       => 'nullable|string|max:255',
        ]);

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
            'password' => Hash::make($validated['password']),
        ]);

        // Generate a simple token (in production, use Laravel Sanctum)
        $token = $member->email_or_username . ':' . bin2hex(random_bytes(16));

        return response()->json([
            'message' => 'Registration successful',
            'member'  => $this->formatMemberResponse($member),
            'token'   => $token,
        ], 201);
    }

    /* ------------------------------------------------------------------ */
    /*  POST /api/auth/login                                              */
    /* ------------------------------------------------------------------ */

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email_or_username' => 'required|string',
            'password' => 'required|string',
        ]);

        $member = Member::active()
            ->where('email_or_username', $validated['email_or_username'])
            ->first();

        if (! $member || ! Hash::check($validated['password'], $member->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $token = $member->email_or_username . ':' . bin2hex(random_bytes(16));

        return response()->json([
            'message' => 'Login successful',
            'member'  => $this->formatMemberResponse($member),
            'token'   => $token,
        ]);
    }

    /* ------------------------------------------------------------------ */
    /*  POST /api/auth/logout                                             */
    /* ------------------------------------------------------------------ */

    public function logout(Request $request): JsonResponse
    {
        // In production, invalidate Sanctum token here
        return response()->json(['message' => 'Logged out successfully']);
    }

    /* ------------------------------------------------------------------ */
    /*  GET /api/auth/me                                                  */
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
    /*  GET /api/members                                                  */
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
                'last_page'    => $members->lastPage(),
                'per_page'     => $members->perPage(),
                'total'        => $members->total(),
            ],
        ]);
    }

    /* ------------------------------------------------------------------ */
    /*  GET /api/members/{id}                                             */
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
    /*  PATCH /api/members/{id}                                           */
    /* ------------------------------------------------------------------ */

    public function update(Request $request, int $id): JsonResponse
    {
        $member = Member::find($id);

        if (! $member) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        $validated = $request->validate([
            'full_name'      => 'sometimes|string|max:255',
            'christian_name' => 'nullable|string|max:255',
            'username'       => 'sometimes|string|unique:members,username,' . $id . '|max:255',
            'password'       => ['sometimes', 'confirmed', Password::defaults()],
            'email_or_username' => 'nullable|string|max:255',
            'mobile'         => 'nullable|string|max:50',
            'gender'         => 'nullable|in:ወንድ,ሴት',
            'age'            => 'nullable|string|max:10',
            'campus'         => 'nullable|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'dorm'           => 'nullable|string|max:255',
            'region'         => 'nullable|string|max:255',
            'zone'           => 'nullable|string|max:255',
            'woreda'         => 'nullable|string|max:255',
            'native_language'  => 'nullable|string|max:255',
            'extra_languages'  => 'nullable|string|max:255',
            'previous_participation' => 'nullable|string|max:255',
            'local_church'   => 'nullable|string|max:255',
            'ordination'     => 'nullable|string|max:255',
            'ordination_year' => 'nullable|string|max:255',
            'diocese'        => 'nullable|string|max:255',
            'bishop'         => 'nullable|string|max:255',
            'service_departments' => 'nullable|array',
            'talents'        => 'nullable|array',
            'talent_description' => 'nullable|string|max:1000',
            'telegram'       => 'nullable|string|max:255',
            'section_id'     => 'nullable|exists:sections,id',
            'is_active'      => 'sometimes|boolean',
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
            'member'  => $this->formatMemberResponse($member),
        ]);
    }

    /* ------------------------------------------------------------------ */
    /*  DELETE /api/members/{id}                                          */
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
    /*  Helpers                                                            */
    /* ------------------------------------------------------------------ */

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
                $photoUrl = asset('storage/' . $member->profile_photo);
            }
        }

        return [
            'id'                   => $member->id,
            'fullName'             => $member->full_name,
            'christianName'        => $member->christian_name,
            'emailOrUsername'      => $member->email_or_username,
            'gender'               => $member->gender,
            'age'                  => $member->age,
            'campus'               => $member->campus,
            'dorm'                 => $member->dorm,
            'languages'            => array_filter(array_merge(
                $member->native_language ? [$member->native_language] : [],
                $member->extra_languages ? explode(',', $member->extra_languages) : [],
            )),
            'talents'              => $member->talents ?? [],
            'services'             => $member->service_departments ?? [],
            'avatar'               => $photoUrl ?? '',
            'email'                => $member->email_or_username ?? '',
            'phone'                => $member->mobile ?? '',
            'telegram'             => $member->telegram ?? '',
            'sectionId'            => $member->section_id,
            'section'              => $member->section ? [
                'id'   => $member->section->id,
                'name' => $member->section->display_name,
            ] : null,
            'isActive'             => $member->is_active,
            'donationAccounts'     => [],  // Future feature
            'region'               => $member->region,
            'zone'                 => $member->zone,
            'woreda'               => $member->woreda,
            'fieldOfStudy'         => $member->field_of_study,
            'previousParticipation'=> $member->previous_participation,
            'localChurch'          => $member->local_church,
            'ordination'           => $member->ordination,
            'ordinationYear'       => $member->ordination_year,
            'diocese'              => $member->diocese,
            'bishop'               => $member->bishop,
            'talentDescription'    => $member->talent_description,
            'createdAt'            => $member->created_at?->toISOString(),
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
