<?php

namespace App\Filament\Resources\Families\Pages;

use App\Filament\Resources\Families\FamilyResource;
use App\Models\Family;
use App\Models\Member;
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ManageRecords;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\HtmlString;
use Illuminate\Validation\ValidationException;

class ManageFamilies extends ManageRecords
{
    protected static string $resource = FamilyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            $this->getFormFamilyAction(),
        ];
    }

    protected function getFormFamilyAction(): Action
    {
        return Action::make('formFamily')
            ->label('Form Family')
            ->icon(Heroicon::OutlinedUserGroup)
            ->color('primary')
            ->modalHeading('Form a New Family')
            ->modalDescription('Assign a family name and select members with their family roles (father, mother, children). Already-assigned members are highlighted.')
            ->modalWidth('3xl')
            ->visible(fn (): bool => FamilyResource::canCreate())
            ->form([
                TextInput::make('family_name')
                    ->label('Family Name')
                    ->placeholder('e.g. ቅዱስ ጊዮርጊስ ቤተሰብ')
                    ->required()
                    ->maxLength(255),

                Repeater::make('family_members')
                    ->label('Family Members & Roles')
                    ->schema([
                        Select::make('member_id')
                            ->label('Select Member')
                            ->placeholder('Search & select member...')
                            ->searchable()
                            ->options(fn (): array => $this->getMemberDropdownOptions())
                            ->disableOptionsWhenSelectedInSiblingRepeaterItems()
                            ->required()
                            ->columnSpan(['sm' => 2, 'md' => 2]),

                        Select::make('role')
                            ->label('Role')
                            ->options([
                                'father' => 'Father (አባት)',
                                'mother' => 'Mother (እናት)',
                                'child'  => 'Child (ልጅ)',
                            ])
                            ->default('child')
                            ->required()
                            ->columnSpan(['sm' => 1, 'md' => 1]),
                    ])
                    ->columns(['sm' => 3, 'md' => 3])
                    ->minItems(1)
                    ->defaultItems(2)
                    ->addActionLabel('+ Add Family Member')
                    ->reorderable(true)
                    ->collapsible(false),
            ])
            ->action(function (array $data): void {
                $familyName = trim((string) ($data['family_name'] ?? ''));
                $entries = $data['family_members'] ?? [];

                if (empty($entries)) {
                    throw ValidationException::withMessages([
                        'family_members' => 'Please add at least one member to the family.',
                    ]);
                }

                $memberIds = collect($entries)
                    ->pluck('member_id')
                    ->filter()
                    ->map(fn ($id): int => (int) $id)
                    ->all();

                if (count($memberIds) !== count(array_unique($memberIds))) {
                    Notification::make()
                        ->title('Duplicate Member Selected')
                        ->body('You cannot add the same member more than once in the same family.')
                        ->danger()
                        ->send();

                    return;
                }

                $membersData = [];
                foreach ($entries as $entry) {
                    $membersData[] = [
                        'member_id' => (int) $entry['member_id'],
                        'role'      => (string) ($entry['role'] ?? 'child'),
                    ];
                }

                Family::create([
                    'family_name'  => $familyName,
                    'members_data' => $membersData,
                ]);

                Member::query()
                    ->whereIn('id', $memberIds)
                    ->update(['is_assigned_to_family' => true]);

                Notification::make()
                    ->title('Family Formed')
                    ->body("Family \"{$familyName}\" has been successfully created with " . count($memberIds) . ' members.')
                    ->success()
                    ->send();
            });
    }

    /**
     * Build member options with clean text label indicating family assignment status.
     *
     * @return array<int, string>
     */
    protected function getMemberDropdownOptions(): array
    {
        $members = Member::query()
            ->orderBy('is_assigned_to_family', 'asc')
            ->orderBy('full_name', 'asc')
            ->get(['id', 'full_name', 'gender', 'batch', 'is_assigned_to_family']);

        $options = [];

        foreach ($members as $member) {
            $name = $member->full_name;
            $meta = [];
            if ($member->gender) {
                $meta[] = $member->gender;
            }
            if ($member->batch) {
                $meta[] = 'Batch ' . $member->batch;
            }
            $metaString = ! empty($meta) ? ' (' . implode(' · ', $meta) . ')' : '';

            $statusPrefix = $member->is_assigned_to_family
                ? '🔴 [ALREADY IN FAMILY]'
                : '🟢 [AVAILABLE]';

            $options[$member->id] = "{$statusPrefix} {$name}{$metaString}";
        }

        return $options;
    }
}
