<?php

namespace App\Filament\Widgets;

use App\Models\Event;
use App\Models\Family;
use App\Models\Member;
use App\Models\Post;
use App\Models\Section;
use App\Models\User;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class FellowshipStatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $user = auth('internal')->user();
        $isSectionLeader = false;
        $leaderSectionIds = [];

        if ($user instanceof User) {
            $leaderSectionIds = $user->ledSections()->pluck('id')->all();
            $isSectionLeader = ! empty($leaderSectionIds);
        }

        // Base member count
        $memberQuery = Member::query();
        if ($isSectionLeader && ! $user->hasRole('admin')) {
            $memberQuery->whereIn('section_id', $leaderSectionIds);
        }
        $totalMembers = $memberQuery->count();

        // Assigned members
        $assignedMembers = (clone $memberQuery)->where('is_assigned_to_family', true)->count();
        $unassignedMembers = $totalMembers - $assignedMembers;

        $stats = [
            Stat::make('Total Members', number_format($totalMembers))
                ->description("{$unassignedMembers} unassigned to families")
                ->descriptionIcon(Heroicon::OutlinedUsers)
                ->color($unassignedMembers > 0 ? 'warning' : 'success')
                ->chart([20, 35, 45, 60, 75, 88, $totalMembers]),

            Stat::make('Formed Families', number_format(Family::count()))
                ->description("{$assignedMembers} members in families")
                ->descriptionIcon(Heroicon::OutlinedHomeModern)
                ->color('primary')
                ->chart([1, 2, 3, 5, 8, 12, max(Family::count(), 1)]),

            Stat::make('Fellowship Sections', number_format(Section::count()))
                ->description(Section::where('is_active', true)->count().' active sections')
                ->descriptionIcon(Heroicon::OutlinedRectangleGroup)
                ->color('info')
                ->chart([1, 2, 2, 3, 3, 4, max(Section::count(), 1)]),

            Stat::make('Upcoming Events & News', number_format(Event::count() + Post::count()))
                ->description(Event::count().' events · '.Post::count().' published posts')
                ->descriptionIcon(Heroicon::OutlinedCalendarDays)
                ->color('success')
                ->chart([2, 4, 3, 6, 7, 5, max(Event::count() + Post::count(), 1)]),
        ];

        return $stats;
    }
}
