<?php

namespace App\Http\Middleware;

use App\Models\MemberToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateMember
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $plainToken = $request->cookie('hugg_token') ?? $request->bearerToken();

        if (! $plainToken) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $tokenHash = hash('sha256', $plainToken);

        $memberToken = MemberToken::query()
            ->where('token_hash', $tokenHash)
            ->with('member')
            ->first();

        if (! $memberToken || ! $memberToken->isValid()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $member = $memberToken->member;

        if (! $member || ! $member->is_active) {
            return response()->json(['message' => 'Your account is deactivated.'], 403);
        }

        // Throttle updating last_used_at to once every 5 minutes
        if ($memberToken->last_used_at === null || $memberToken->last_used_at->diffInMinutes(now()) >= 5) {
            $memberToken->update(['last_used_at' => now()]);
        }

        $request->setUserResolver(fn () => $member);
        $request->attributes->set('auth_member', $member);
        $request->attributes->set('auth_token_record', $memberToken);

        return $next($request);
    }
}
