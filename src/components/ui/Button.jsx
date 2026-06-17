export default function Button({ children, onClick, variant = 'primary', disabled = false, type = 'button', className = '' }) {
  const base = 'font-sans font-semibold rounded-lg px-5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:   'bg-[var(--color-primary)] text-[var(--color-background)] hover:bg-[var(--color-primary-hover)]',
    secondary: 'bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-accent)]',
    ghost:     'text-[var(--color-primary)] underline underline-offset-2 hover:text-[var(--color-primary-hover)] px-0 py-0',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
