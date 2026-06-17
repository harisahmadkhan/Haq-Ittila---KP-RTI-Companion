export default function IconBridge({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="16" x2="22" y2="16" />
      <path d="M6 16 Q6 10 12 10 Q18 10 18 16" />
      <line x1="6" y1="10" x2="6" y2="20" />
      <line x1="18" y1="10" x2="18" y2="20" />
    </svg>
  );
}
