export default function Badge({ children, party }) {
  const colours = {
    PTI:   'bg-nizam_green-50 text-nizam_green-800',
    ANP:   'bg-warning_accent text-warning',
    'JUI-F': 'bg-primary_accent text-primary',
  };
  const cls = colours[party] || 'bg-gray-100 text-foreground';

  return (
    <span className={`inline-block text-xs font-semibold font-sans px-2 py-0.5 rounded-full ${cls}`}>
      {children}
    </span>
  );
}
