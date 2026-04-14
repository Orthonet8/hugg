<?php

use App\Http\Controllers\ApiMemberController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/google/redirect', [ApiMemberController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [ApiMemberController::class, 'googleCallback']);
