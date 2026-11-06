@php
    $membersData = collect($record->members_data ?? []);
    $totalMembers = $membersData->count();
    $father = $record->father;
    $mother = $record->mother;
    $children = collect($record->members_data ?? [])
        ->filter(fn (array $entry): bool => ($entry['role'] ?? null) === 'child')
        ->map(fn (array $entry) => \App\Models\Member::find($entry['member_id'] ?? null))
        ->filter();

    $placeholder = 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="32" fill="#E5E7EB"/><path d="M32 34.5c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13Z" fill="#9CA3AF"/><path d="M13 54c2.1-7.7 9.2-13 19-13s16.9 5.3 19 13" stroke="#9CA3AF" stroke-width="4" stroke-linecap="round"/></svg>');
@endphp

<div class="my-1.5 overflow-hidden rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs transition hover:border-amber-400 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900">
    {{-- Top bar: Family Name & Badge --}}
    <div class="mb-2 flex items-center justify-between gap-2 border-b border-gray-100 pb-2 dark:border-gray-800/80">
        <div class="flex items-center gap-2 min-w-0">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-2xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                </svg>
            </span>
            <h3 class="truncate text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {{ $record->family_name }}
            </h3>
        </div>
        <span class="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-300">
            <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            {{ $totalMembers }} Members
        </span>
    </div>

    {{-- Parents Row (Compact) --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        {{-- Father --}}
        <div class="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50/30 px-2.5 py-1.5 dark:border-blue-950/40 dark:bg-blue-950/15">
            <img
                src="{{ $father?->profile_photo ? asset('storage/' . $father->profile_photo) : $placeholder }}"
                alt="{{ $father?->full_name ?? 'Father' }}"
                class="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-blue-400/30"
            />
            <div class="min-w-0 flex-1 leading-tight">
                <div class="flex items-center gap-1.5">
                    <span class="text-[9px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Father</span>
                    @if ($father?->batch)
                        <span class="text-[9px] text-gray-400">· {{ $father->batch }}</span>
                    @endif
                </div>
                <div class="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {{ $father?->full_name ?? '—' }}
                </div>
            </div>
        </div>

        {{-- Mother --}}
        <div class="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50/30 px-2.5 py-1.5 dark:border-rose-950/40 dark:bg-rose-950/15">
            <img
                src="{{ $mother?->profile_photo ? asset('storage/' . $mother->profile_photo) : $placeholder }}"
                alt="{{ $mother?->full_name ?? 'Mother' }}"
                class="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-rose-400/30"
            />
            <div class="min-w-0 flex-1 leading-tight">
                <div class="flex items-center gap-1.5">
                    <span class="text-[9px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">Mother</span>
                    @if ($mother?->batch)
                        <span class="text-[9px] text-gray-400">· {{ $mother->batch }}</span>
                    @endif
                </div>
                <div class="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {{ $mother?->full_name ?? '—' }}
                </div>
            </div>
        </div>
    </div>

    {{-- Children Pills (Compact inline flexwrap) --}}
    @if ($children->isNotEmpty())
        <div class="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100/80 dark:border-gray-800/60">
            <span class="text-[9px] font-bold uppercase tracking-wider text-gray-400 mr-1">Children:</span>
            @foreach ($children as $child)
                <span class="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-gray-50/80 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    <img
                        src="{{ $child->profile_photo ? asset('storage/' . $child->profile_photo) : $placeholder }}"
                        alt="{{ $child->full_name }}"
                        class="h-4 w-4 rounded-full object-cover"
                    />
                    <span class="truncate max-w-[130px]">{{ $child->full_name }}</span>
                    @if ($child->batch)
                        <span class="text-[9px] text-gray-400">({{ $child->batch }})</span>
                    @endif
                </span>
            @endforeach
        </div>
    @endif
</div>
