export default function StatusTag({ children, variant = 'success' }) {
  const variants = {
    success: 'bg-success_accent text-success',
    danger:  'bg-danger_accent text-danger',
    warning: 'bg-warning_accent text-warning',
    muted:   'bg-gray-100 text-muted',
  };

  return (
    <span className={`inline-block text-xs font-semibold font-sans px-2.5 py-1 rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
}
