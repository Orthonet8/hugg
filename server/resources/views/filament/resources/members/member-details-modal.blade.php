@php
    $member = $record;
    $placeholder = 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="32" fill="#E5E7EB"/><path d="M32 34.5c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13Z" fill="#9CA3AF"/><path d="M13 54c2.1-7.7 9.2-13 19-13s16.9 5.3 19 13" stroke="#9CA3AF" stroke-width="4" stroke-linecap="round"/></svg>');
    $photo = $member->profile_photo ? asset('storage/' . $member->profile_photo) : $placeholder;

    $services = is_array($member->service_departments)
        ? $member->service_departments
        : (is_string($member->service_departments) ? array_filter(array_map('trim', explode(',', $member->service_departments))) : []);

    $talents = is_array($member->talents)
        ? $member->talents
        : (is_string($member->talents) ? array_filter(array_map('trim', explode(',', $member->talents))) : []);

    $languages = array_filter([
        $member->native_language ? $member->native_language . ' (Native)' : null,
        $member->extra_languages,
    ]);

    $sections = [
        [
            'title' => 'Identity',
            'icon'  => 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z',
            'items' => [
                ['Full Name', $member->full_name],
                ['Christian Name', $member->christian_name],
                ['Gender', $member->gender],
                ['Age', $member->age],
            ],
        ],
        [
            'title' => 'Campus & Contact',
            'icon'  => 'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342',
            'items' => [
                ['Campus', $member->campus],
                ['Dorm Room', $member->dorm],
                ['Batch', $member->batch ? 'Batch ' . $member->batch : null],
                ['Field of Study', $member->field_of_study],
                ['Phone Number', $member->mobile],
                ['Telegram', $member->telegram],
                ['Username / Email', $member->email_or_username],
            ],
        ],
        [
            'title' => 'Emergency & Account',
            'icon'  => 'M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z',
            'items' => [
                ['Parent Phone', $member->parent_phone],
                ['Emergency Contacts', $member->emergency_contacts],
                ['Bank Account Number', $member->account_number],
                ['Account Holder Name', $member->account_name],
                ['Bank / Account Type', $member->account_type],
            ],
        ],
        [
            'title' => 'Background & Origin',
            'icon'  => 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
            'items' => [
                ['Region', $member->region],
                ['Zone', $member->zone],
                ['Woreda', $member->woreda],
                ['Languages', ! empty($languages) ? implode(', ', $languages) : null],
            ],
        ],
        [
            'title' => 'Church Background',
            'icon'  => 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.333A2.25 2.25 0 0 0 18.25 8.083h-12.5A2.25 2.25 0 0 0 3.5 10.333V21',
            'items' => [
                ['Previous Participation', $member->previous_participation],
                ['Local Church', $member->local_church],
                ['Section', $member->section?->display_name ?? $member->section?->name_am],
                ['Ordination', $member->ordination],
                ['Ordination Year', $member->ordination_year],
                ['Diocese', $member->diocese],
                ['Bishop', $member->bishop],
            ],
        ],
        [
            'title' => 'Skills & Services',
            'icon'  => 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z',
            'items' => [
                ['Service Departments', ! empty($services) ? implode(', ', $services) : null],
                ['Talents', ! empty($talents) ? implode(', ', $talents) : null],
                ['Talent Detail', $member->talent_description],
            ],
        ],
    ];
@endphp

<div class="space-y-5 py-2">
    {{-- Profile Hero Card --}}
    <div class="overflow-hidden rounded-2xl border border-gray-200/90 bg-gradient-to-b from-primary-500/10 via-white to-white p-6 shadow-xs dark:border-gray-800 dark:from-primary-950/30 dark:via-gray-900 dark:to-gray-900">
        <div class="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div class="relative shrink-0">
                <img
                    src="{{ $photo }}"
                    alt="{{ $member->full_name }}"
                    class="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-primary-500/30 dark:border-gray-800"
                />
                @if ($member->is_active)
                    <span class="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" title="Active Member"></span>
                @endif
            </div>

            <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        {{ $member->full_name }}
                    </h2>
                    @if ($member->christian_name)
                        <span class="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
                            {{ $member->christian_name }}
                        </span>
                    @endif
                </div>

                <div class="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{{ $member->email_or_username }}</span>
                    @if ($member->batch)
                        <span>· Batch {{ $member->batch }}</span>
                    @endif
                    @if ($member->gender)
                        <span>· {{ $member->gender }}</span>
                    @endif
                    @if ($member->section)
                        <span>· <strong class="text-primary-600 dark:text-primary-400">{{ $member->section->display_name }}</strong></span>
                    @endif
                </div>

                <div class="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <svg class="h-3 w-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd"/>
                        </svg>
                        Registered Member
                    </span>

                    @if ($member->is_assigned_to_family)
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300">
                            In Family
                        </span>
                    @else
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                            No Family
                        </span>
                    @endif

                    @if ($member->mobile)
                        <a href="tel:{{ $member->mobile }}" class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-primary-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-primary-400">
                            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/></svg>
                            {{ $member->mobile }}
                        </a>
                    @endif

                    @if ($member->telegram)
                        <a href="https://t.me/{{ ltrim($member->telegram, '@') }}" target="_blank" class="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300">
                            Telegram: {{ Str::startsWith($member->telegram, '@') ? $member->telegram : '@' . $member->telegram }}
                        </a>
                    @endif
                </div>
            </div>
        </div>
    </div>

    {{-- Registration Details Card (like app_frontend ProfilePage) --}}
    <div class="rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
            <div>
                <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Registration Details
                </h3>
                <p class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    Full information saved from fellowship member onboarding & profile.
                </p>
            </div>
            <span class="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                Member #{{ $member->id }}
            </span>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
            @foreach ($sections as $section)
                @php
                    $visibleItems = array_filter($section['items'], fn ($item) => filled($item[1]));
                @endphp

                <div class="rounded-2xl border border-gray-200/80 bg-gray-50/50 p-4 shadow-2xs dark:border-gray-800/80 dark:bg-gray-900/50">
                    <div class="mb-3 flex items-center gap-2.5 border-b border-gray-200/60 pb-2.5 dark:border-gray-800">
                        <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white shadow-2xs">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="{{ $section['icon'] }}" />
                            </svg>
                        </span>
                        <p class="text-xs font-bold uppercase tracking-[0.14em] text-gray-900 dark:text-gray-100">
                            {{ $section['title'] }}
                        </p>
                    </div>

                    @if (empty($visibleItems))
                        <p class="py-2 text-xs italic text-gray-400 dark:text-gray-500">No details registered for this section.</p>
                    @else
                        <div class="grid gap-2 sm:grid-cols-2">
                            @foreach ($visibleItems as $item)
                                <div class="min-w-0 rounded-xl border border-gray-200/70 bg-white px-3 py-2.5 shadow-2xs dark:border-gray-800 dark:bg-gray-800/80">
                                    <p class="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
                                        {{ $item[0] }}
                                    </p>
                                    <p class="mt-1 break-words text-xs font-semibold leading-snug text-gray-800 dark:text-gray-100">
                                        {{ $item[1] }}
                                    </p>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
</div>
