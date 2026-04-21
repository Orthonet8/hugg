<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiEventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Event::query()->where('is_active', true);

        if ($date = $request->query('date')) {
            $query->whereDate('date', $date);
        }

        if ($dept = $request->query('department')) {
            $query->where('department', $dept);
        }

        $events = $query->orderBy('date')->get();

        return response()->json(
            $events->map(fn (Event $e) => [
                'id'          => (string) $e->id,
                'title'       => $e->title,
                'description' => $e->description ?? '',
                'department'  => $e->department,
                'date'        => $e->date->toDateString(),
                'time'        => $e->time ?? '',
                'location'    => $e->location ?? '',
            ])
        );
    }
}
