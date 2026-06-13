import UrduText from '../ui/UrduText.jsx';

export default function Header() {
  return (
    <header className="bg-surface border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-sans font-bold text-xl text-foreground tracking-tight">
            Haq Ittila
            <span className="ml-2 text-muted font-normal text-sm">حق اطلاع</span>
          </h1>
          <p className="text-xs text-muted font-sans mt-0.5">KP Right to Information Companion</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-sans text-muted">KP RTI Act 2013</span>
        </div>
      </div>
    </header>
  );
}
