export default function UrduText({ children, display = false, className = '' }) {
  const font  = display ? 'font-nastaliq' : 'font-naskh';
  const size  = display ? 'text-2xl leading-loose' : 'text-base leading-loose';
  return (
    <span dir="rtl" lang="ur" className={`${font} ${size} ${className}`}>
      {children}
    </span>
  );
}
