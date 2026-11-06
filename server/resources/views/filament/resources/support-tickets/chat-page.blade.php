@php
    $member = $ticket->member;
    $assignedUser = $ticket->assignedUser;
    $placeholder = 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="32" fill="#E5E7EB"/><path d="M32 34.5c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 13Z" fill="#9CA3AF"/><path d="M13 54c2.1-7.7 9.2-13 19-13s16.9 5.3 19 13" stroke="#9CA3AF" stroke-width="4" stroke-linecap="round"/></svg>');

    $sectorAmharic = [
        'Spiritual & Prayer'    => 'መንፈሳዊ እና ጸሎት',
        'Academic & Campus'     => 'ትምህርት እና ግቢ',
        'Counseling & Personal' => 'ምክር እና የግል ጉዳይ',
        'Charity & Financial'   => 'ልማት እና ድጋፍ',
        'Technical & Media'     => 'ቴክኒክ እና ሚዲያ',
        'General Inquiries'     => 'አጠቃላይ ጥያቄ',
    ];
    $amText = $sectorAmharic[$ticket->sector] ?? '';
@endphp

<x-filament-panels::page>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {{-- Left Side: Beautiful Chat Window --}}
        <div class="lg:col-span-8 flex flex-col rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
            {{-- Chat Header --}}
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <div class="flex items-center gap-3 min-w-0">
                    <img
                        src="{{ $member?->profile_photo ? asset('storage/' . $member->profile_photo) : $placeholder }}"
                        class="h-11 w-11 rounded-2xl object-cover ring-2 ring-primary-500/20"
                        alt="{{ $member?->full_name }}"
                    />
                    <div class="min-w-0">
                        <div class="flex items-center gap-2">
                            <h3 class="truncate text-base font-bold text-gray-900 dark:text-gray-100">
                                {{ $member?->full_name ?? 'Member' }}
                            </h3>
                            <span class="inline-flex items-center rounded-md bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700 dark:bg-primary-950/70 dark:text-primary-300">
                                {{ $ticket->sector }} @if($amText) · {{ $amText }} @endif
                            </span>
                        </div>
                        <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                            {{ $ticket->subject }}
                        </p>
                    </div>
                </div>

                {{-- Status Pills dropdown / toggle --}}
                <div class="flex items-center gap-1.5">
                    @foreach(['open' => 'Open', 'in_progress' => 'Active', 'resolved' => 'Resolved', 'closed' => 'Closed'] as $stKey => $stLabel)
                        <button
                            type="button"
                            wire:click="setStatus('{{ $stKey }}')"
                            class="rounded-xl px-2.5 py-1 text-xs font-semibold transition-all
                                {{ $ticket->status === $stKey
                                    ? ($stKey === 'open' ? 'bg-amber-500 text-white shadow-xs' :
                                       ($stKey === 'in_progress' ? 'bg-blue-600 text-white shadow-xs' :
                                       ($stKey === 'resolved' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-700 text-white shadow-xs')))
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                }}">
                            {{ $stLabel }}
                        </button>
                    @endforeach
                </div>
            </div>

            {{-- Chat Stream --}}
            <div class="flex-1 space-y-4 p-5 max-h-[560px] min-h-[420px] overflow-y-auto bg-slate-50/40 dark:bg-gray-950/30">
                @forelse ($ticket->messages as $msg)
                    @php
                        $isUser = $msg->sender_type === 'user';
                        $senderName = $isUser
                            ? (\App\Models\User::find($msg->sender_id)?->name ?? 'Supporter')
                            : ($member?->full_name ?? 'Member');
                        $senderAvatar = $isUser
                            ? (\App\Models\User::find($msg->sender_id)?->avatar_url ? asset('storage/' . \App\Models\User::find($msg->sender_id)->avatar_url) : $placeholder)
                            : ($member?->profile_photo ? asset('storage/' . $member->profile_photo) : $placeholder);

                        $isVoiceNote = $msg->attachment_type === 'audio' ||
                            ($msg->attachment_url && (
                                str_contains($msg->attachment_url, 'voice_note') ||
                                str_ends_with($msg->attachment_url, '.opus') ||
                                str_ends_with($msg->attachment_url, '.ogg') ||
                                str_ends_with($msg->attachment_url, '.webm') ||
                                str_ends_with($msg->attachment_url, '.mp3')
                            ));
                    @endphp

                    <div class="flex items-end gap-2.5 {{ $isUser ? 'flex-row-reverse' : '' }}">
                        <img
                            src="{{ $senderAvatar }}"
                            class="h-7 w-7 rounded-full object-cover shrink-0 ring-1 ring-black/5 dark:ring-white/10"
                            alt="{{ $senderName }}"
                        />

                        <div class="max-w-[78%] space-y-1">
                            <div class="rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-xs
                                {{ $isUser
                                    ? 'bg-primary-600 text-white rounded-br-xs'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700/60'
                                }}">
                                @if ($msg->message)
                                    <p class="whitespace-pre-wrap selection:bg-white/30">{{ $msg->message }}</p>
                                @endif

                                @if ($msg->attachment_url)
                                    @php $fileUrl = asset('storage/' . $msg->attachment_url); @endphp
                                    <div class="mt-2.5 pt-2 border-t {{ $isUser ? 'border-primary-400/50' : 'border-gray-100 dark:border-gray-700' }}">
                                        @if ($isVoiceNote)
                                            <div class="flex items-center gap-3 py-1">
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-xs {{ $isUser ? 'bg-white/20 text-white' : 'bg-primary-600 text-white' }}">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v7.5a3 3 0 0 1-3 3Z" />
                                                    </svg>
                                                </div>
                                                <div class="min-w-0 flex-1">
                                                    <span class="text-[10px] font-bold uppercase tracking-wider opacity-85 block">
                                                        Voice Note · የድምፅ መልዕክት
                                                    </span>
                                                    <audio controls class="h-8 w-full max-w-[240px] mt-1">
                                                        <source src="{{ $fileUrl }}" />
                                                    </audio>
                                                </div>
                                            </div>
                                        @elseif ($msg->attachment_type === 'image')
                                            <a href="{{ $fileUrl }}" target="_blank" class="block overflow-hidden rounded-xl border border-black/5">
                                                <img src="{{ $fileUrl }}" class="max-h-60 w-auto rounded-lg object-cover hover:scale-[1.02] transition-transform duration-200" alt="Attachment" />
                                            </a>
                                        @elseif ($msg->attachment_type === 'video')
                                            <video controls class="max-h-60 w-full rounded-xl bg-black">
                                                <source src="{{ $fileUrl }}" />
                                            </video>
                                        @else
                                            <a href="{{ $fileUrl }}" target="_blank" download class="inline-flex items-center gap-2 font-medium underline text-xs">
                                                📎 {{ $msg->attachment_name ?: 'Attachment Document' }}
                                            </a>
                                        @endif
                                    </div>
                                @endif
                            </div>

                            <div class="flex items-center gap-1 text-[10px] text-gray-400 {{ $isUser ? 'justify-end' : '' }}">
                                <span>{{ $msg->created_at?->format('h:i A') }}</span>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                        <span class="text-3xl mb-2">💬</span>
                        <p class="text-sm font-medium">No messages yet</p>
                        <p class="text-xs text-gray-400 mt-0.5">Send a reply below to start conversing with {{ $member?->full_name ?? 'the member' }}.</p>
                    </div>
                @endforelse
            </div>

            {{-- Compact Message Composer with In-App Audio Voice Recorder for Admin/Staff --}}
            <div
                x-data="{
                    isRecording: false,
                    seconds: 0,
                    timer: null,
                    mediaRecorder: null,
                    audioChunks: [],
                    audioUrl: null,

                    async startRecording() {
                        try {
                            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                            this.audioChunks = [];
                            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus') ? 'audio/ogg;codecs=opus' : 'audio/webm');
                            this.mediaRecorder = new MediaRecorder(stream, { mimeType });

                            this.mediaRecorder.ondataavailable = (e) => {
                                if (e.data.size > 0) this.audioChunks.push(e.data);
                            };

                            this.mediaRecorder.onstop = () => {
                                const blob = new Blob(this.audioChunks, { type: mimeType });
                                const ext = mimeType.includes('ogg') ? 'ogg' : 'webm';
                                const file = new File([blob], `staff_voice_note_${Date.now()}.${ext}`, { type: mimeType });
                                @this.upload('attachment', file);
                                this.audioUrl = URL.createObjectURL(blob);
                                stream.getTracks().forEach(t => t.stop());
                            };

                            this.mediaRecorder.start();
                            this.isRecording = true;
                            this.seconds = 0;
                            this.timer = setInterval(() => { this.seconds++; }, 1000);
                        } catch (err) {
                            alert('Microphone permission denied or device not supported.');
                        }
                    },

                    stopRecording() {
                        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                            this.mediaRecorder.stop();
                        }
                        if (this.timer) { clearInterval(this.timer); this.timer = null; }
                        this.isRecording = false;
                    },

                    cancelRecording() {
                        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                            this.mediaRecorder.onstop = null;
                            this.mediaRecorder.stop();
                            this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
                        }
                        if (this.timer) { clearInterval(this.timer); this.timer = null; }
                        this.isRecording = false;
                        this.seconds = 0;
                        this.audioUrl = null;
                        @this.set('attachment', null);
                    },

                    formatTime(s) {
                        const m = Math.floor(s / 60);
                        const r = s % 60;
                        return `${m}:${r < 10 ? '0' : ''}${r}`;
                    }
                }"
                class="border-t border-gray-100 p-4 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
                @if ($attachment)
                    <div class="mb-3 flex items-center justify-between rounded-xl bg-primary-50 px-3 py-2 text-xs text-primary-900 dark:bg-primary-950 dark:text-primary-200">
                        <span class="truncate font-semibold">📎 Ready to upload: {{ method_exists($attachment, 'getClientOriginalName') ? $attachment->getClientOriginalName() : 'File/Voice Note selected' }}</span>
                        <button type="button" wire:click="$set('attachment', null)" @click="audioUrl = null" class="text-rose-600 hover:underline font-bold text-xs">Remove</button>
                    </div>
                @endif

                <template x-if="isRecording">
                    <div class="flex items-center justify-between rounded-2xl bg-rose-50 px-4 py-2.5 border border-rose-200 text-rose-700 animate-pulse">
                        <div class="flex items-center gap-3">
                            <span class="h-3 w-3 rounded-full bg-rose-600 animate-ping"></span>
                            <span class="text-xs font-bold">Recording Voice Note...</span>
                            <span class="rounded-lg bg-rose-200/80 px-2 py-0.5 text-xs font-mono font-bold" x-text="formatTime(seconds)"></span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button type="button" @click="cancelRecording()" class="rounded-xl p-1.5 text-gray-500 hover:bg-rose-100 transition">
                                ✕ Cancel
                            </button>
                            <button type="button" @click="stopRecording()" class="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-rose-700">
                                ■ Done
                            </button>
                        </div>
                    </div>
                </template>

                <form x-show="!isRecording" wire:submit.prevent="sendMessage" class="flex items-center gap-2">
                    <label class="cursor-pointer rounded-2xl p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors">
                        <input type="file" wire:model="attachment" class="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx" />
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.37l-9.546 9.547a1.5 1.5 0 0 1-2.122-2.122l8.486-8.486" />
                        </svg>
                    </label>

                    {{-- Staff Record Button --}}
                    <button
                        type="button"
                        @click="startRecording()"
                        title="Record Voice Note"
                        class="rounded-2xl p-2.5 text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v7.5a3 3 0 0 1-3 3Z" />
                        </svg>
                    </button>

                    <input
                        type="text"
                        wire:model.defer="reply_message"
                        placeholder="Type a reply or record voice note..."
                        class="flex-1 rounded-2xl border-0 bg-gray-100 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                    />

                    <button
                        type="submit"
                        class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm transition hover:bg-primary-700 active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>

        {{-- Right Side: Minimal Information Sidebar --}}
        <div class="lg:col-span-4 space-y-4">
            {{-- Member Contact Card --}}
            <div class="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Member Contact</span>
                <div class="mt-3 flex items-center gap-3">
                    <img
                        src="{{ $member?->profile_photo ? asset('storage/' . $member->profile_photo) : $placeholder }}"
                        class="h-12 w-12 rounded-2xl object-cover"
                        alt="{{ $member?->full_name }}"
                    />
                    <div class="min-w-0">
                        <h4 class="truncate font-bold text-gray-900 dark:text-gray-100">{{ $member?->full_name ?? 'Unknown Member' }}</h4>
                        <p class="truncate text-xs text-gray-500">{{ $member?->email_or_username }}</p>
                    </div>
                </div>

                {{-- Clean Text Contact Display --}}
                <div class="mt-4 flex flex-col gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
                    @if ($member?->mobile)
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400">Phone:</span>
                            <span class="font-medium text-gray-800 dark:text-gray-200">{{ $member->mobile }}</span>
                        </div>
                    @endif
                    @if ($member?->telegram)
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400">Telegram:</span>
                            <span class="font-medium text-sky-600 dark:text-sky-400">@{{ ltrim($member->telegram, '@') }}</span>
                        </div>
                    @endif
                </div>
            </div>

            {{-- Ticket Meta Card --}}
            <div class="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 text-xs space-y-3">
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ticket Details</span>

                <div class="flex items-center justify-between">
                    <span class="text-gray-500">Status</span>
                    <span class="font-bold uppercase tracking-wider text-primary-600">{{ $ticket->status }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-500">Sector</span>
                    <span class="font-semibold text-gray-900 dark:text-gray-100">{{ $ticket->sector }} @if($amText) ({{ $amText }}) @endif</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-500">Priority</span>
                    <span class="font-semibold text-gray-900 dark:text-gray-100">{{ ucfirst($ticket->priority) }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-500">Created</span>
                    <span class="text-gray-600 dark:text-gray-300">{{ $ticket->created_at?->diffForHumans() }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-500">Assigned To</span>
                    <span class="font-semibold text-gray-900 dark:text-gray-100">{{ $assignedUser?->name ?? 'Unassigned' }}</span>
                </div>
            </div>
        </div>
    </div>
</x-filament-panels::page>
