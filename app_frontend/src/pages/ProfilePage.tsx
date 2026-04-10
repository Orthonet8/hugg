import "./profile-stitch.css";

export const ProfilePage = () => {
  return (
    <div className="stitch-profile-page min-h-[max(884px,100dvh)] bg-[#fcf9f4] text-[#1c1c19]">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-[#fdfaf5] px-6">
        <button
          type="button"
          className="rounded-full p-2 text-[#5f0113] transition-transform hover:bg-[#5f0113]/5 active:scale-95"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="stitch-headline text-lg font-bold tracking-tight text-[#5f0113]">
          Profile
        </h1>
        <button
          type="button"
          className="rounded-full p-2 text-[#5f0113] transition-transform hover:bg-[#5f0113]/5 active:scale-95"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <main className="space-y-8 px-5 pb-32 pt-20">
        <section className="relative">
          <div className="relative flex flex-col items-center overflow-hidden rounded-xl border border-[rgba(221,192,191,0.15)] bg-[#f6f3ee] p-8 text-center">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[rgba(255,225,124,0.1)] blur-3xl" />

            <div className="relative mb-6 inline-block">
              <div className="h-28 w-28 rounded-full border-4 border-[#390007] bg-[#fcf9f4] p-1">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaerd7meZgXw8ILC1OV460GYYCrtR2eMXXB66lBxKdn-mBDdXrPg-WHr5qy-yHMIzQY1s2sCUPcTN8ihzDvWufLVBOgl4v14-N9bxZg3XRGDXu-z9D9FEmAMHppFcC0VM4yWRFdU1T9cRyMaWMgKrYZJWjQ2ZiimfSZktkVedfaCjR8z8Vg7BdbWakAlWTTSbayApsaHywDx6Idd__VCDiE8kLb1Vn1cQ48mBRgEQWcd3a2qhc0aGyRagTyVY_7RnU5HpBfJ46CGG6"
                  alt="portrait of a confident ethiopian student with a warm smile in a university campus setting with soft natural light"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 rounded-full border-2 border-[#fcf9f4] bg-[#5f0113] p-2 text-white shadow-lg transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined text-[18px]">
                  edit
                </span>
              </button>
            </div>

            <h2 className="stitch-headline amharic-text text-2xl font-extrabold text-[#390007]">
              አቤል ተስፋዬ
            </h2>
            <p className="mt-1 text-sm font-bold uppercase tracking-widest text-[#715c00]">
              Christian Name: ወልደ ማርያም
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#e5e2dd] px-4 py-1">
              <span
                className="material-symbols-outlined text-sm text-[#874f50]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span className="amharic-text text-xs font-semibold text-[#574241]">
                የግቢ ጉባኤ አባል
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="stitch-headline amharic-text px-1 text-lg text-[#390007]">
            የግል መረጃ
          </h3>
          <div className="divide-y divide-[rgba(221,192,191,0.15)] rounded-xl bg-[#f6f3ee]">
            <div className="group flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0ede9] text-[#390007]">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-[#574241]">
                    Campus
                  </p>
                  <p className="amharic-text font-semibold text-[#1c1c19]">
                    አዲስ አበባ ቴክኖሎጂ ኢንስቲትዩት
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#ddc0bf]">
                chevron_right
              </span>
            </div>

            <div className="group flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0ede9] text-[#390007]">
                  <span className="material-symbols-outlined">apartment</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-[#574241]">
                    Dorm
                  </p>
                  <p className="amharic-text font-semibold text-[#1c1c19]">
                    ብሎክ 12, ክፍል 402
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#ddc0bf]">
                chevron_right
              </span>
            </div>

            <div className="group flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0ede9] text-[#390007]">
                  <span className="material-symbols-outlined">phone</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-[#574241]">
                    Phone
                  </p>
                  <p className="font-semibold text-[#1c1c19]">
                    +251 911 223 344
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#ddc0bf]">
                chevron_right
              </span>
            </div>

            <div className="group flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0ede9] text-[#390007]">
                  <span className="material-symbols-outlined">send</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-[#574241]">
                    Telegram
                  </p>
                  <p className="font-semibold text-[#1c1c19]">
                    @abel_t_fellowship
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#ddc0bf]">
                chevron_right
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="stitch-headline amharic-text px-1 text-lg text-[#390007]">
            ተሰጥኦዎች እና አገልግሎቶች
          </h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-full border border-[rgba(221,192,191,0.1)] bg-[#ebe8e3] px-4 py-2 text-[#1c1c19]">
              <span className="material-symbols-outlined text-sm text-[#715c00]">
                translate
              </span>
              <span className="amharic-text text-xs font-bold">አማርኛ</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[rgba(221,192,191,0.1)] bg-[#ebe8e3] px-4 py-2 text-[#1c1c19]">
              <span className="material-symbols-outlined text-sm text-[#715c00]">
                translate
              </span>
              <span className="amharic-text text-xs font-bold">English</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#ffe17c] px-4 py-2 text-[#231b00]">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                music_note
              </span>
              <span className="amharic-text text-xs font-bold">መዝሙር</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#ffe17c] px-4 py-2 text-[#231b00]">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                menu_book
              </span>
              <span className="amharic-text text-xs font-bold">ትምህርት</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#ffe17c] px-4 py-2 text-[#231b00]">
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
          <h3 className="stitch-headline amharic-text px-1 text-lg text-[#390007]">
            የልግስና ሂሳቦች
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="sacred-gradient relative aspect-video overflow-hidden rounded-xl p-5 text-white shadow-xl shadow-[#390007]/20">
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10 blur-xl" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="material-symbols-outlined text-[#ffe17c]">
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

            <div className="flex aspect-video flex-col justify-between rounded-xl border border-[rgba(221,192,191,0.15)] bg-[#e5e2dd] p-5 text-[#1c1c19]">
              <span className="material-symbols-outlined text-[#390007]">
                account_balance_wallet
              </span>
              <div className="mt-4">
                <p className="amharic-text text-[10px] text-[#574241]">
                  አቢሲኒያ ባንክ
                </p>
                <p className="text-sm font-bold tracking-tight">988776655</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <p className="amharic-text px-1 text-[11px] font-bold uppercase tracking-[2px] text-[#574241]">
              መተግበሪያ
            </p>

            <div className="overflow-hidden rounded-xl border border-[rgba(221,192,191,0.1)] bg-[#f6f3ee]">
              <button
                type="button"
                className="flex w-full items-center gap-4 p-4 text-left transition-colors active:bg-[#5f0113]/5"
              >
                <span className="material-symbols-outlined text-[#390007]">
                  notifications
                </span>
                <span className="amharic-text flex-1 text-sm font-semibold">
                  ማሳወቂያዎች
                </span>
                <span className="material-symbols-outlined text-[#ddc0bf]">
                  chevron_right
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-4 p-4 text-left transition-colors active:bg-[#5f0113]/5"
              >
                <span className="material-symbols-outlined text-[#390007]">
                  language
                </span>
                <span className="amharic-text flex-1 text-sm font-semibold">
                  ቋንቋ (Amharic)
                </span>
                <span className="material-symbols-outlined text-[#ddc0bf]">
                  chevron_right
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-4 p-4 text-left transition-colors active:bg-[#5f0113]/5"
              >
                <span className="material-symbols-outlined text-[#390007]">
                  help
                </span>
                <span className="amharic-text flex-1 text-sm font-semibold">
                  እርዳታ እና ድጋፍ
                </span>
                <span className="material-symbols-outlined text-[#ddc0bf]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-[rgba(221,192,191,0.1)] bg-[#f6f3ee]">
              <button
                type="button"
                className="flex w-full items-center gap-4 p-4 text-left transition-colors active:bg-[#ba1a1a]/5"
              >
                <span className="material-symbols-outlined text-[#ba1a1a]">
                  logout
                </span>
                <span className="amharic-text flex-1 text-sm font-semibold text-[#ba1a1a]">
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
