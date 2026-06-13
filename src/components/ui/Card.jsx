export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface rounded-xl border border-gray-200 p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
