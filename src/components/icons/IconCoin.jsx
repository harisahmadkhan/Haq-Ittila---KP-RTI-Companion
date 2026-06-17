export default function IconCoin({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5a3 3 0 0 0-5 2.2c0 1.7 1.3 2.5 2.5 3.3 1.2.8 2.5 1.6 2.5 3.3" />
      <path d="M9.5 14.5a3 3 0 0 0 5-2.2" />
      <line x1="12" y1="7" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="17" />
    </svg>
  );
}
