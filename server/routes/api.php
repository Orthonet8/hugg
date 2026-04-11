<?php

use App\Http\Controllers\ApiMemberController;
use Illuminate\Support\Facades\Route;

/* ------------------------------------------------------------------ */
/*  Public routes — no authentication required */
/* ------------------------------------------------------------------ */
Route::post('/auth/register', [ApiMemberController::class, 'register']);
Route::post('/auth/login', [ApiMemberController::class, 'login']);

/* ------------------------------------------------------------------ */
/*  Public family routes */
/* ------------------------------------------------------------------ */
Route::get('/families', [ApiMemberController::class, 'familiesIndex']);
Route::get('/families/{id}', [ApiMemberController::class, 'familiesShow']);

/* ------------------------------------------------------------------ */
/*  Protected routes — require Bearer token */
/* ------------------------------------------------------------------ */
Route::middleware('api')->group(function () {
    // Auth
    Route::post('/auth/logout', [ApiMemberController::class, 'logout']);
    Route::get('/auth/me', [ApiMemberController::class, 'me']);

    // Members CRUD
    Route::apiResource('members', ApiMemberController::class)->except(['store']);
});
