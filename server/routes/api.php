<?php

use App\Http\Controllers\ApiEventController;
use App\Http\Controllers\ApiMemberController;
use App\Http\Controllers\ApiPostController;
use App\Http\Controllers\ApiSupportController;
use Illuminate\Support\Facades\Route;

/* ------------------------------------------------------------------ */
/*  Public routes — no authentication required */
/* ------------------------------------------------------------------ */
Route::post('/auth/register', [ApiMemberController::class, 'register']);
Route::post('/auth/login', [ApiMemberController::class, 'login']);
Route::post('/auth/forgot-password', [ApiMemberController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [ApiMemberController::class, 'resetPassword']);
Route::get('/auth/check-identifier', [ApiMemberController::class, 'checkIdentifier']);
Route::get('/auth/google/redirect', [ApiMemberController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [ApiMemberController::class, 'googleCallback']);

/* ------------------------------------------------------------------ */
/*  Public family routes */
/* ------------------------------------------------------------------ */
Route::get('/families', [ApiMemberController::class, 'familiesIndex']);
Route::get('/families/{id}', [ApiMemberController::class, 'familiesShow']);
Route::get('/events', [ApiEventController::class, 'index']);
Route::get('/posts', [ApiPostController::class, 'index']);
Route::get('/posts/{id}', [ApiPostController::class, 'show']);

/* ------------------------------------------------------------------ */
/*  Protected routes — require Bearer token */
/* ------------------------------------------------------------------ */
Route::middleware('api')->group(function () {
    // Auth
    Route::post('/auth/logout', [ApiMemberController::class, 'logout']);
    Route::get('/auth/me', [ApiMemberController::class, 'me']);

    // Members CRUD
    Route::match(['post', 'patch'], 'members/{id}/profile', [ApiMemberController::class, 'updateProfile']);
    Route::patch('members/{id}/credentials', [ApiMemberController::class, 'updateCredentials']);
    Route::apiResource('members', ApiMemberController::class)->except(['store']);

    // Help & Support
    Route::get('/support/supporters', [ApiSupportController::class, 'supporters']);
    Route::get('/support/tickets', [ApiSupportController::class, 'tickets']);
    Route::post('/support/tickets', [ApiSupportController::class, 'createTicket']);
    Route::get('/support/tickets/{id}', [ApiSupportController::class, 'showTicket']);
    Route::post('/support/tickets/{id}/messages', [ApiSupportController::class, 'sendMessage']);
});
