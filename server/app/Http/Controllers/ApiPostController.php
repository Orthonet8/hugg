<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiPostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::query()->where('is_active', true)->with('sections');

        if ($dept = $request->query('department')) {
            $query->where('department', $dept);
        }

        // Filter by audience: show 'all' posts + section-specific posts for the member's section
        $sectionId = $request->query('section_id');
        if ($sectionId) {
            $query->where(function ($q) use ($sectionId) {
                $q->where('audience_type', 'all')
                  ->orWhere(function ($q2) use ($sectionId) {
                      $q2->where('audience_type', 'sections')
                         ->whereHas('sections', fn ($s) => $s->where('sections.id', $sectionId));
                  });
            });
        } else {
            $query->where('audience_type', 'all');
        }

        $posts = $query->orderByDesc('published_at')->get();

        return response()->json(
            $posts->map(fn (Post $p) => [
                'id'          => (string) $p->id,
                'title'       => $p->title,
                'content'     => $p->content ?? '',
                'department'  => $p->department,
                'author'      => $p->author ?? '',
                'publishedAt' => $p->published_at?->toISOString() ?? $p->created_at->toISOString(),
                'imageUrls'   => collect($p->image_urls ?? [])->map(
                    fn (string $path) => filter_var($path, FILTER_VALIDATE_URL)
                        ? $path
                        : asset('storage/' . $path)
                )->values()->all(),
            ])
        );
    }
}
