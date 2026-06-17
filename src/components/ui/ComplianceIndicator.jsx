export default function ComplianceIndicator({ rating, note }) {
  const styles = {
    low:     { pill: 'bg-[var(--color-danger-accent)] text-[var(--color-danger)]',   label: 'Low Compliance' },
    medium:  { pill: 'bg-[var(--color-warning-accent)] text-[var(--color-warning)]', label: 'Medium Compliance' },
    unknown: { pill: 'bg-[var(--color-unknown-accent)] text-[var(--color-muted)]',   label: 'Compliance Unknown' },
  };
  const { pill, label } = styles[rating] || styles.unknown;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`inline-block text-xs font-semibold font-sans px-2.5 py-1 rounded-full ${pill}`}>
        {label}
      </span>
      {note && (
        <span className="text-xs text-[var(--color-muted)] font-sans italic">{note}</span>
      )}
    </div>
  );
}
