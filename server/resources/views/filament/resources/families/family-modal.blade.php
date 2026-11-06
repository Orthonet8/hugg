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

<div class="space-y-5 py-1">
    {{-- Top header banner --}}
    <div class="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 border border-amber-200/50 dark:border-amber-900/40">
        <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm ring-4 ring-amber-500/15">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                </svg>
            </span>
            <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ $record->family_name }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Created {{ $record->created_at?->format('M d, Y') }}</p>
            </div>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
            <span class="h-2 w-2 rounded-full bg-amber-600"></span>
            {{ $totalMembers }} Members
        </span>
    </div>

    {{-- Parents: Father & Mother with Full Contact Details --}}
    <div>
        <h4 class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Family Heads (ወላጆች)
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {{-- Father --}}
            @if ($father)
                <div class="flex flex-col justify-between rounded-xl border border-blue-200/80 bg-blue-50/30 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/20">
                    <div class="flex items-start gap-3">
                        <img
                            src="{{ $father->profile_photo ? asset('storage/' . $father->profile_photo) : $placeholder }}"
                            alt="{{ $father->full_name }}"
                            class="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-blue-500/30"
                        />
                        <div class="min-w-0 flex-1">
                            <span class="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                                Father (አባት)
                            </span>
                            <div class="truncate text-sm font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                                {{ $father->full_name }}
                            </div>
                            @if ($father->christian_name)
                                <div class="text-[11px] text-gray-500 italic">{{ $father->christian_name }}</div>
                            @endif
                        </div>
                    </div>

                    {{-- Contact details --}}
                    <div class="mt-3.5 space-y-1.5 border-t border-blue-100/80 pt-2.5 text-xs text-gray-600 dark:border-blue-900/40 dark:text-gray-300">
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400 text-[11px] w-14 shrink-0">Phone:</span>
                            @if ($father->mobile)
                                <a href="tel:{{ $father->mobile }}" class="font-medium text-blue-600 hover:underline dark:text-blue-400">{{ $father->mobile }}</a>
                            @else
                                <span class="italic text-gray-400">—</span>
                            @endif
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400 text-[11px] w-14 shrink-0">Telegram:</span>
                            @if ($father->telegram)
                                <a href="https://t.me/{{ ltrim($father->telegram, '@') }}" target="_blank" class="font-medium text-blue-600 hover:underline dark:text-blue-400">
                                    {{ Str::startsWith($father->telegram, '@') ? $father->telegram : '@' . $father->telegram }}
                                </a>
                            @else
                                <span class="italic text-gray-400">—</span>
                            @endif
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400 text-[11px] w-14 shrink-0">Campus:</span>
                            <span class="font-medium">{{ $father->campus ?? '—' }}{{ $father->dorm ? ' (Dorm: ' . $father->dorm . ')' : '' }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400 text-[11px] w-14 shrink-0">Batch:</span>
                            <span class="font-medium">{{ $father->batch ? 'Batch ' . $father->batch : '—' }}</span>
                        </div>
                    </div>
                </div>
            @else
                <div class="rounded-xl border border-dashed border-gray-300 p-4 text-center text-xs italic text-gray-400 dark:border-gray-700">
                    No father assigned
                </div>
            @endif

            {{-- Mother --}}
            @if ($mother)
                <div class="flex flex-col justify-between rounded-xl border border-rose-200/80 bg-rose-50/30 p-3.5 dark:border-rose-900/50 dark:bg-rose-950/20">
                    <div class="flex items-start gap-3">
                        <img
                            src="{{ $mother->profile_photo ? asset('storage/' . $mother->profile_photo) : $placeholder }}"
                            alt="{{ $mother->full_name }}"
                            class="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-rose-500/30"
                        />
                        <div class="min-w-0 flex-1">
                            <span class="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
                                Mother (እናት)
                            </span>
                            <div class="truncate text-sm font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                                {{ $mother->full_name }}
                            </div>
                            @if ($mother->christian_name)
                                <div class="text-[11px] text-gray-500 italic">{{ $mother->christian_name }}</div>
                            @endif
                        </div>
                    </div>

                    {{-- Contact details --}}
                    <div class="mt-3.5 space-y-1.5 border-t border-rose-100/80 pt-2.5 text-xs text-gray-600 dark:border-rose-900/40 dark:text-gray-300">
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400 text-[11px] w-14 shrink-0">Phone:</span>
                            @if ($mother->mobile)
                                <a href="tel:{{ $mother->mobile }}" class="font-medium text-rose-600 hover:underline dark:text-rose-400">{{ $mother->mobile }}</a>
                            @else
                                <span class="italic text-gray-400">—</span>
                            @endif
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400 text-[11px] w-14 shrink-0">Telegram:</span>
                            @if ($mother->telegram)
                                <a href="https://t.me/{{ ltrim($mother->telegram, '@') }}" target="_blank" class="font-medium text-rose-600 hover:underline dark:text-rose-400">
                                    {{ Str::startsWith($mother->telegram, '@') ? $mother->telegram : '@' . $mother->telegram }}
                                </a>
                            @else
                                <span class="italic text-gray-400">—</span>
                            @endif
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400 text-[11px] w-14 shrink-0">Campus:</span>
                            <span class="font-medium">{{ $mother->campus ?? '—' }}{{ $mother->dorm ? ' (Dorm: ' . $mother->dorm . ')' : '' }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400 text-[11px] w-14 shrink-0">Batch:</span>
                            <span class="font-medium">{{ $mother->batch ? 'Batch ' . $mother->batch : '—' }}</span>
                        </div>
                    </div>
                </div>
            @else
                <div class="rounded-xl border border-dashed border-gray-300 p-4 text-center text-xs italic text-gray-400 dark:border-gray-700">
                    No mother assigned
                </div>
            @endif
        </div>
    </div>

    {{-- Children Members List with Contacts --}}
    <div>
        <div class="mb-2.5 flex items-center justify-between">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Children / Members (ልጆች)
            </h4>
            <span class="text-xs text-gray-400">{{ $children->count() }} members</span>
        </div>

        @if ($children->isEmpty())
            <div class="rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs italic text-gray-400 dark:border-gray-800">
                No children added to this family.
            </div>
        @else
            <div class="divide-y divide-gray-100 rounded-xl border border-gray-200/80 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
                @foreach ($children as $child)
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 hover:bg-gray-50/50 transition dark:hover:bg-gray-800/40">
                        <div class="flex items-center gap-3 min-w-0">
                            <img
                                src="{{ $child->profile_photo ? asset('storage/' . $child->profile_photo) : $placeholder }}"
                                alt="{{ $child->full_name }}"
                                class="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                            />
                            <div class="min-w-0">
                                <div class="truncate text-xs font-bold text-gray-900 dark:text-gray-100">
                                    {{ $child->full_name }}
                                </div>
                                <div class="text-[11px] text-gray-400">
                                    {{ $child->gender ?? '—' }}{{ $child->batch ? ' · Batch ' . $child->batch : '' }}
                                    @if ($child->section)
                                        · <span class="text-primary-600 font-medium">{{ $child->section->name }}</span>
                                    @endif
                                </div>
                            </div>
                        </div>

                        {{-- Child contacts --}}
                        <div class="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300 sm:justify-end">
                            @if ($child->mobile)
                                <a href="tel:{{ $child->mobile }}" class="inline-flex items-center gap-1 font-medium text-primary-600 hover:underline dark:text-primary-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                    </svg>
                                    {{ $child->mobile }}
                                </a>
                            @endif

                            @if ($child->telegram)
                                <a href="https://t.me/{{ ltrim($child->telegram, '@') }}" target="_blank" class="inline-flex items-center gap-1 font-medium text-sky-600 hover:underline dark:text-sky-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                    </svg>
                                    {{ Str::startsWith($child->telegram, '@') ? $child->telegram : '@' . $child->telegram }}
                                </a>
                            @endif

                            @if (! $child->mobile && ! $child->telegram)
                                <span class="text-[11px] italic text-gray-400">No contact provided</span>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</div>
