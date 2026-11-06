@php
    $messages = $ticket->messages()->with('ticket')->get();
    $member = $ticket->member;
    $assignedUser = $ticket->assignedUser;
    $placeholder = 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="32" fill="#E5E7EB"/><path d="M32 34.5c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13Z" fill="#9CA3AF"/><path d="M13 54c2.1-7.7 9.2-13 19-13s16.9 5.3 19 13" stroke="#9CA3AF" stroke-width="4" stroke-linecap="round"/></svg>');
@endphp

<div class="space-y-4 py-1">
    {{-- Ticket Header Overview --}}
    <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/90 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-gray-900/60">
        <div class="flex items-center gap-3 min-w-0">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.502 49.188 49.188 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
                </svg>
            </span>
            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                    <span class="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-800 dark:bg-primary-950 dark:text-primary-300">
                        {{ $ticket->sector }}
                    </span>
                    <span class="text-xs font-semibold text-gray-500">Ticket #{{ $ticket->id }}</span>
                </div>
                <h3 class="truncate text-base font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                    {{ $ticket->subject }}
                </h3>
            </div>
        </div>

        <div class="flex items-center gap-2">
            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                @if($ticket->status === 'open') bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300
                @elseif($ticket->status === 'in_progress') bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300
                @elseif($ticket->status === 'resolved') bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300
                @else bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 @endif">
                {{ ucfirst(str_replace('_', ' ', $ticket->status)) }}
            </span>
            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                @if($ticket->priority === 'urgent') bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300
                @elseif($ticket->priority === 'high') bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300
                @else bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 @endif">
                {{ ucfirst($ticket->priority) }} Priority
            </span>
        </div>
    </div>

    {{-- Parties: Member & Supporter summary --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="flex items-center gap-2.5 rounded-xl border border-gray-200/70 bg-white p-2.5 dark:border-gray-800 dark:bg-gray-900">
            <img
                src="{{ $member?->profile_photo ? asset('storage/' . $member->profile_photo) : $placeholder }}"
                class="h-8 w-8 rounded-full object-cover"
                alt="{{ $member?->full_name }}"
            />
            <div class="min-w-0 flex-1">
                <span class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Member</span>
                <div class="truncate font-bold text-gray-900 dark:text-gray-100">{{ $member?->full_name ?? '—' }}</div>
                <div class="text-[10px] text-gray-500">
                    {{ $member?->mobile ? 'Tel: ' . $member->mobile : $member?->email_or_username }}
                    @if ($member?->telegram) · Telegram: {{ $member->telegram }} @endif
                </div>
            </div>
        </div>

        <div class="flex items-center gap-2.5 rounded-xl border border-gray-200/70 bg-white p-2.5 dark:border-gray-800 dark:bg-gray-900">
            <img
                src="{{ $assignedUser?->avatar_url ? asset('storage/' . $assignedUser->avatar_url) : $placeholder }}"
                class="h-8 w-8 rounded-full object-cover"
                alt="{{ $assignedUser?->name ?? 'Supporter' }}"
            />
            <div class="min-w-0 flex-1">
                <span class="text-[9px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">Assigned Supporter</span>
                <div class="truncate font-bold text-gray-900 dark:text-gray-100">{{ $assignedUser?->name ?? 'Unassigned' }}</div>
                <div class="text-[10px] text-gray-500">
                    {{ $assignedUser?->phone ? 'Tel: ' . $assignedUser->phone : ($assignedUser?->telegram_username ? '@' . $assignedUser->telegram_username : 'Assigned from Admin') }}
                </div>
            </div>
        </div>
    </div>

    {{-- Chat Thread --}}
    <div class="rounded-2xl border border-gray-200/90 bg-gray-50/40 p-4 dark:border-gray-800 dark:bg-gray-900/40">
        <h4 class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Conversation History ({{ $messages->count() }} messages)
        </h4>

        @if ($messages->isEmpty())
            <div class="py-8 text-center text-xs italic text-gray-400">
                No messages in this ticket yet. Reply below to start the conversation with the member.
            </div>
        @else
            <div class="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                @foreach ($messages as $msg)
                    @php
                        $isUser = $msg->sender_type === 'user';
                        $senderName = $isUser
                            ? (\App\Models\User::find($msg->sender_id)?->name ?? 'Supporter')
                            : ($member?->full_name ?? 'Member');
                        $senderAvatar = $isUser
                            ? (\App\Models\User::find($msg->sender_id)?->avatar_url ? asset('storage/' . \App\Models\User::find($msg->sender_id)->avatar_url) : $placeholder)
                            : ($member?->profile_photo ? asset('storage/' . $member->profile_photo) : $placeholder);
                    @endphp

                    <div class="flex items-start gap-2.5 {{ $isUser ? 'flex-row-reverse' : '' }}">
                        <img src="{{ $senderAvatar }}" class="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700" alt="{{ $senderName }}" />

                        <div class="max-w-[78%]">
                            <div class="flex items-center gap-2 mb-1 {{ $isUser ? 'justify-end' : '' }}">
                                <span class="text-[11px] font-bold text-gray-800 dark:text-gray-200">{{ $senderName }}</span>
                                <span class="text-[10px] text-gray-400">{{ $msg->created_at?->diffForHumans() }}</span>
                            </div>

                            <div class="rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs
                                {{ $isUser
                                    ? 'bg-primary-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-none dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
                                }}">
                                @if ($msg->message)
                                    <p class="whitespace-pre-wrap">{{ $msg->message }}</p>
                                @endif

                                {{-- Attachment Display (Voice, Video, Photo, Document) --}}
                                @if ($msg->attachment_url)
                                    @php
                                        $fileUrl = asset('storage/' . $msg->attachment_url);
                                    @endphp
                                    <div class="mt-2.5 pt-2 border-t {{ $isUser ? 'border-primary-500' : 'border-gray-200 dark:border-gray-700' }}">
                                        @if ($msg->attachment_type === 'image')
                                            <a href="{{ $fileUrl }}" target="_blank" class="block overflow-hidden rounded-lg border border-white/20">
                                                <img src="{{ $fileUrl }}" class="max-h-48 w-auto rounded object-cover" alt="Attachment" />
                                            </a>
                                        @elseif ($msg->attachment_type === 'audio')
                                            <div class="flex flex-col gap-1">
                                                <span class="text-[10px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1">
                                                    🎙️ Voice Message
                                                </span>
                                                <audio controls class="w-full max-w-[280px] h-8">
                                                    <source src="{{ $fileUrl }}" />
                                                    Your browser does not support audio.
                                                </audio>
                                            </div>
                                        @elseif ($msg->attachment_type === 'video')
                                            <div class="flex flex-col gap-1">
                                                <span class="text-[10px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1">
                                                    🎥 Video Clip
                                                </span>
                                                <video controls class="max-h-52 w-full rounded-lg bg-black">
                                                    <source src="{{ $fileUrl }}" />
                                                    Your browser does not support video.
                                                </video>
                                            </div>
                                        @else
                                            <a href="{{ $fileUrl }}" target="_blank" download class="inline-flex items-center gap-1.5 font-semibold underline text-xs">
                                                📎 Download {{ $msg->attachment_name ?: 'Attachment' }}
                                            </a>
                                        @endif
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</div>
