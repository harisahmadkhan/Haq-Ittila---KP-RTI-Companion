export default function DemoModeBadge({ isDemo }) {
  const label = isDemo ? 'DEMO MODE' : 'LIVE';
  const dotColor = isDemo ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-success)]';

  return (
    <span className="inline-flex items-center gap-1.5 border border-[var(--color-primary)] rounded-full px-3 py-1 text-xs font-sans font-semibold text-[var(--color-primary)] bg-[var(--color-primary-accent)]">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 badge-pulse ${dotColor}`} />
      {label}
    </span>
  );
}
