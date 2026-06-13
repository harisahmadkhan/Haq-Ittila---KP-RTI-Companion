export default function Button({ children, onClick, variant = 'primary', disabled = false, type = 'button', className = '' }) {
  const base = 'font-sans font-semibold rounded-lg px-5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-nizam_green-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:   'bg-primary text-white hover:bg-nizam_green-600',
    secondary: 'bg-primary_accent text-primary hover:bg-nizam_green-100',
    ghost:     'text-primary underline underline-offset-2 hover:text-nizam_green-700 px-0 py-0',
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
