function KPEmblem() {
  return (
    <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 flex-shrink-0">
      <circle cx="28" cy="28" r="26" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
      <circle cx="28" cy="28" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
      {/* Crescent */}
      <path
        d="M31 13C22.7 13 16 19.7 16 28C16 36.3 22.7 43 31 43C27.8 42.2 23 36.8 23 28C23 19.2 27.2 13.8 31 13Z"
        fill="white" opacity="0.92"
      />
      {/* Five-pointed star */}
      <polygon
        points="40,19 41.4,23.5 46,23.5 42.3,26.2 43.7,30.7 40,28 36.3,30.7 37.7,26.2 34,23.5 38.6,23.5"
        fill="white" opacity="0.92"
      />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-nizam_green-800 via-nizam_green-700 to-nizam_green-500 shadow-xl">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-sans font-bold text-xl text-white tracking-tight">
            Haq Ittila
            <span className="ml-2 font-naskh text-white/70 font-normal text-base">حق اطلاع</span>
          </h1>
          <p className="text-xs text-white/65 font-sans mt-0.5">KP Right to Information Companion</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-sans text-white font-semibold leading-snug">Government of Khyber Pakhtunkhwa</p>
            <p className="text-xs font-sans text-white/60">KP RTI Act 2013</p>
          </div>
          <KPEmblem />
        </div>
      </div>
    </header>
  );
}
