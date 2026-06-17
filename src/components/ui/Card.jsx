export default function Card({ children, className = '', accent = false }) {
  return (
    <div
      className={`bg-transparent border border-[var(--color-border)] rounded-xl p-6
        ${accent ? 'border-l-4 border-l-[var(--color-primary)]' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
