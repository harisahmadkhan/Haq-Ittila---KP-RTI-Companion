export default function TabNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'feed',  label: 'RTI Feed',      urdu: 'فیڈ' },
    { id: 'file',  label: 'File RTI',      urdu: 'درخواست' },
    { id: 'track', label: 'Track My RTI',  urdu: 'ٹریک' },
  ];

  return (
    <nav className="border-b border-[var(--color-border)]" style={{ background: 'linear-gradient(to right, var(--color-background), #0f2b1a, #0B2417)' }}>
      <div className="max-w-7xl mx-auto px-4 flex items-end gap-1">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative px-5 py-3 font-sans text-sm font-semibold transition-colors flex items-center gap-2
                ${isActive
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] -mb-px'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)] border-b-2 border-transparent'
                }
              `}
            >
              {tab.label}
              <span className={`font-naskh text-xs ${isActive ? 'text-[var(--color-primary)]/70' : 'text-[var(--color-muted)]/60'}`}>
                {tab.urdu}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
