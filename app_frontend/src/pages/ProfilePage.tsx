import "./profile-stitch.css";

export const ProfilePage = () => {
  return (
    <div className="stitch-profile-page min-h-[max(884px,100dvh)] bg-[color:var(--bg)] text-[color:var(--text-primary)]">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-[color:var(--surface)] px-6 border-b border-[color:var(--border)]">
        <button
          type="button"
          className="rounded-full p-2 text-[color:var(--primary)] transition-transform hover:bg-[color:var(--soft-hover)] active:scale-95"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="stitch-headline text-lg font-bold tracking-tight text-[color:var(--primary)]">
          Profile
        </h1>
        <button
          type="button"
          className="rounded-full p-2 text-[color:var(--primary)] transition-transform hover:bg-[color:var(--soft-hover)] active:scale-95"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <main className="space-y-8 px-5 pb-32 pt-6">
        <section className="relative">
          <div className="relative flex flex-col items-center overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-8 text-center">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] blur-3xl" />

            <div className="relative mb-6 inline-block">
              <div className="h-28 w-28 rounded-full border-4 border-[color:var(--primary)] bg-[color:var(--bg)] p-1">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaerd7meZgXw8ILC1OV460GYYCrtR2eMXXB66lBxKdn-mBDdXrPg-WHr5qy-yHMIzQY1s2sCUPcTN8ihzDvWufLVBOgl4v14-N9bxZg3XRGDXu-z9D9FEmAMHppFcC0VM4yWRFdU1T9cRyMaWMgKrYZJWjQ2ZiimfSZktkVedfaCjR8z8Vg7BdbWakAlWTTSbayApsaHywDx6Idd__VCDiE8kLb1Vn1cQ48mBRgEQWcd3a2qhc0aGyRagTyVY_7RnU5HpBfJ46CGG6"
                  alt="portrait of a confident ethiopian student with a warm smile in a university campus setting with soft natural light"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 rounded-full border-2 border-[color:var(--bg)] bg-[color:var(--primary)] p-2 text-[color:var(--on-primary)] shadow-lg transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined text-[18px]">
                  edit
                </span>
              </button>
            </div>

            <h2 className="stitch-headline amharic-text text-2xl font-extrabold text-[color:var(--primary)]">
              አቤል ተስፋዬ
            </h2>
            <p className="mt-1 text-sm font-bold uppercase tracking-widest text-[color:var(--accent-hover)]">
              Christian Name: ወልደ ማርያም
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-strong)] px-4 py-1">
              <span
                className="material-symbols-outlined text-sm text-[color:var(--primary)]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span className="amharic-text text-xs font-semibold text-[color:var(--text-secondary)]">
                የግቢ ጉባኤ አባል
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="stitch-headline amharic-text px-1 text-lg text-[color:var(--primary)]">
            የግል መረጃ
          </h3>
          <div className="divide-y divide-[color:var(--border)] rounded-xl bg-[color:var(--surface-soft)]">
            <div className="group flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--surface-strong)] text-[color:var(--primary)]">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-[color:var(--text-muted)]">
                    Campus
                  </p>
                  <p className="amharic-text font-semibold text-[color:var(--text-primary)]">
                    አዲስ አበባ ቴክኖሎጂ ኢንስቲትዩት
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[color:var(--border-strong)]">
                chevron_right
              </span>
            </div>

            <div className="group flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--surface-strong)] text-[color:var(--primary)]">
                  <span className="material-symbols-outlined">apartment</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-[color:var(--text-muted)]">
                    Dorm
                  </p>
                  <p className="amharic-text font-semibold text-[color:var(--text-primary)]">
                    ብሎክ 12, ክፍል 402
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[color:var(--border-strong)]">
                chevron_right
              </span>
            </div>

            <div className="group flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--surface-strong)] text-[color:var(--primary)]">
                  <span className="material-symbols-outlined">phone</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-[color:var(--text-muted)]">
                    Phone
                  </p>
                  <p className="font-semibold text-[color:var(--text-primary)]">
                    +251 9** *** ***
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[color:var(--border-strong)]">
                chevron_right
              </span>
            </div>

            <div className="group flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--surface-strong)] text-[color:var(--primary)]">
                  <span className="material-symbols-outlined">send</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-[color:var(--text-muted)]">
                    Telegram
                  </p>
                  <p className="font-semibold text-[color:var(--text-primary)]">
                    @abel_t_fellowship
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[color:var(--border-strong)]">
                chevron_right
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="stitch-headline amharic-text px-1 text-lg text-[color:var(--primary)]">
            ተሰጥኦዎች እና አገልግሎቶች
          </h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-2 text-[color:var(--text-primary)]">
              <span className="material-symbols-outlined text-sm text-[color:var(--accent-hover)]">
                translate
              </span>
              <span className="amharic-text text-xs font-bold">አማርኛ</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-2 text-[color:var(--text-primary)]">
              <span className="material-symbols-outlined text-sm text-[color:var(--accent-hover)]">
                translate
              </span>
              <span className="amharic-text text-xs font-bold">English</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-[color:var(--on-accent)]">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                music_note
              </span>
              <span className="amharic-text text-xs font-bold">መዝሙር</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-[color:var(--on-accent)]">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                menu_book
              </span>
              <span className="amharic-text text-xs font-bold">ትምህርት</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-[color:var(--on-accent)]">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                volunteer_activism
              </span>
              <span className="amharic-text text-xs font-bold">ልግስና</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="stitch-headline amharic-text px-1 text-lg text-[color:var(--primary)]">
            የልግስና ሂሳቦች
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="app-gradient relative aspect-video overflow-hidden rounded-xl p-5 text-[color:var(--on-primary)] shadow-xl shadow-[color:color-mix(in_srgb,var(--primary)_20%,transparent)]">
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10 blur-xl" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="material-symbols-outlined text-[color:var(--accent)]">
                  account_balance
                </span>
                <div className="mt-4">
                  <p className="amharic-text text-[10px] opacity-70">
                    ሲቢኢ (CBE)
                  </p>
                  <p className="text-sm font-bold tracking-tight">
                    100023456789
                  </p>
                </div>
              </div>
            </div>

            <div className="flex aspect-video flex-col justify-between rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-5 text-[color:var(--text-primary)]">
              <span className="material-symbols-outlined text-[color:var(--primary)]">
                account_balance_wallet
              </span>
              <div className="mt-4">
                <p className="amharic-text text-[10px] text-[color:var(--text-muted)]">
                  አቢሲኒያ ባንክ
                </p>
                <p className="text-sm font-bold tracking-tight">988776655</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <p className="amharic-text px-1 text-[11px] font-bold uppercase tracking-[2px] text-[color:var(--text-muted)]">
              መተግበሪያ
            </p>

            <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)]">
              <button
                type="button"
                className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-[color:var(--soft-hover)]"
              >
                <span className="material-symbols-outlined text-[color:var(--primary)]">
                  notifications
                </span>
                <span className="amharic-text flex-1 text-sm font-semibold text-[color:var(--text-primary)]">
                  ማሳወቂያዎች
                </span>
                <span className="material-symbols-outlined text-[color:var(--border-strong)]">
                  chevron_right
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-[color:var(--soft-hover)]"
              >
                <span className="material-symbols-outlined text-[color:var(--primary)]">
                  language
                </span>
                <span className="amharic-text flex-1 text-sm font-semibold text-[color:var(--text-primary)]">
                  ቋንቋ (Amharic)
                </span>
                <span className="material-symbols-outlined text-[color:var(--border-strong)]">
                  chevron_right
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-[color:var(--soft-hover)]"
              >
                <span className="material-symbols-outlined text-[color:var(--primary)]">
                  help
                </span>
                <span className="amharic-text flex-1 text-sm font-semibold text-[color:var(--text-primary)]">
                  እርዳታ እና ድጋፍ
                </span>
                <span className="material-symbols-outlined text-[color:var(--border-strong)]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)]">
              <button
                type="button"
                className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-[color:var(--dept-edu-bg)]"
              >
                <span className="material-symbols-outlined text-[color:var(--dept-edu-dot)]">
                  logout
                </span>
                <span className="amharic-text flex-1 text-sm font-semibold text-[color:var(--dept-edu-dot)]">
                  ውጣ
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
