<?php

use App\Http\Controllers\ApiMemberController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Google OAuth
Route::get('/auth/google/redirect', [ApiMemberController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [ApiMemberController::class, 'googleCallback']);

// Convenient direct redirects for member authentication
Route::redirect('/login', '/app/login');
Route::redirect('/register', '/app/login?mode=signup');

// Member Portal SPA (served from public/app/index.html)
Route::get('/app/{any?}', function (?string $any = null) {
    if ($any && preg_match('/\.[a-zA-Z0-9]+$/', $any)) {
        abort(404);
    }

    $index = public_path('app/index.html');
    if (file_exists($index)) {
        return response()->file($index, ['Content-Type' => 'text/html']);
    }

    return view('welcome');
})->where('any', '.*');

// Landing Page SPA (served from public/landing/index.html)
Route::get('/', function () {
    $index = public_path('landing/index.html');
    if (file_exists($index)) {
        return response()->file($index, ['Content-Type' => 'text/html']);
    }

    return view('welcome');
});

// SPA Fallback for Landing Page routes (/about, /blog, /background, etc.)
Route::fallback(function (Request $request) {
    // If request has a file extension (e.g. missing static asset), return 404
    if (preg_match('/\.[a-zA-Z0-9]+$/', $request->path())) {
        abort(404);
    }

    $index = public_path('landing/index.html');
    if (file_exists($index)) {
        return response()->file($index, ['Content-Type' => 'text/html']);
    }

    return view('welcome');
});
