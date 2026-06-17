export default function IconBat({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Cricket bat — cylindrical handle + wide blade */}
      <line x1="8" y1="16" x2="3" y2="21" />
      <rect x="7.5" y="5" width="4" height="13" rx="2" />
      <path d="M7.5 8 Q5 7 5 11 Q5 15 7.5 16" />
      <path d="M11.5 8 Q14 7 14 11 Q14 15 11.5 16" />
    </svg>
  );
}
