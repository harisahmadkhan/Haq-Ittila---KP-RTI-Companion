import { PARTY_INFO } from '../../data/parties.js';

export default function Badge({ children, party }) {
  const info = PARTY_INFO[party];
  if (info) {
    return (
      <span
        className="inline-block text-xs font-semibold font-sans px-2 py-0.5 rounded-full text-[var(--color-foreground)]"
        style={{ background: `linear-gradient(135deg, ${info.colorFrom}, ${info.colorTo})` }}
      >
        {children}
      </span>
    );
  }
  return (
    <span className="inline-block text-xs font-semibold font-sans px-2 py-0.5 rounded-full bg-[var(--color-unknown-accent)] text-[var(--color-foreground)]">
      {children}
    </span>
  );
}
