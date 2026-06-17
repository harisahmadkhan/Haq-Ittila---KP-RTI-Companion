export default function StatusTag({ children, variant = 'success' }) {
  const variants = {
    success: 'bg-[var(--color-success-accent)] text-[var(--color-success)]',
    danger:  'bg-[var(--color-danger-accent)] text-[var(--color-danger)]',
    warning: 'bg-[var(--color-warning-accent)] text-[var(--color-warning)]',
    muted:   'bg-[var(--color-unknown-accent)] text-[var(--color-muted)]',
  };

  return (
    <span className={`inline-block text-xs font-semibold font-sans px-2.5 py-1 rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
}
