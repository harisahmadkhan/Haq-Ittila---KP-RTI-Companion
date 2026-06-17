import { useState, useEffect } from 'react';

const STATUSES = [
  { key: 'filed',    label: 'Filed',             color: 'text-[var(--color-success)] border-[var(--color-success)] bg-[var(--color-success-accent)]' },
  { key: 'received', label: 'Response Received', color: 'text-[var(--color-warning)] border-[var(--color-warning)] bg-[var(--color-warning-accent)]' },
  { key: 'no-response', label: 'No Response',    color: 'text-[var(--color-danger)] border-[var(--color-danger)] bg-[var(--color-danger-accent)]' },
];

export default function TrackerToggle({ department, filedDate }) {
  const storageKey = `rti-tracker-${department?.name}-${filedDate}`;
  const [status, setStatus] = useState(() => {
    try { return localStorage.getItem(storageKey) || 'filed'; } catch { return 'filed'; }
  });

  useEffect(() => {
    try { localStorage.setItem(storageKey, status); } catch {}
  }, [status, storageKey]);

  return (
    <div className="border border-[var(--color-border)] rounded-xl p-5 mb-5">
      <h3 className="font-sans font-semibold text-[var(--color-foreground)] text-sm mb-3">Track Your RTI Status</h3>
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s.key}
            onClick={() => setStatus(s.key)}
            className={`font-sans text-xs font-semibold px-4 py-2 rounded-lg border transition-colors
              ${status === s.key ? s.color : 'text-[var(--color-muted)] border-[var(--color-border)] bg-transparent hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}
            `}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="font-sans text-xs text-[var(--color-muted)] mt-2">
        Your self-reported status — saved locally on this device.
      </p>
    </div>
  );
}
