<?php

use App\Http\Controllers\ApiMemberController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $index = public_path('landing/index.html');
    if (file_exists($index)) {
        return response()->file($index, ['Content-Type' => 'text/html']);
    }
    return view('welcome');
});

Route::get('/app/{any?}', function () {
    $index = public_path('app/index.html');
    if (file_exists($index)) {
        return response()->file($index, ['Content-Type' => 'text/html']);
    }
    return view('welcome');
})->where('any', '.*');

Route::get('/auth/google/redirect', [ApiMemberController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [ApiMemberController::class, 'googleCallback']);
