import { useState } from 'react';
import Button from '../ui/Button.jsx';
import DeadlineTimer from '../ui/DeadlineTimer.jsx';
import { getFilingById, simulateDaysPassed } from '../../lib/rtiTracker.js';

const STAGES = [
  { id: 'filed',     label: 'Filed' },
  { id: 'awaiting',  label: 'Awaiting Response' },
  { id: 'received',  label: 'Response Received / Escalated' },
  { id: 'closed',    label: 'Closed' },
];

function statusToStageIndex(status) {
  if (status === 'answered') return 3;
  if (status === 'overdue')  return 2;
  return 1;
}

function OctagonBadge({ done, active, n }) {
  const border = done || active ? 'var(--color-primary)' : 'rgba(201,162,39,0.3)';
  const bg     = active ? 'var(--color-primary)' : done ? 'transparent' : 'transparent';
  const color  = done || active ? (active ? 'var(--color-background)' : 'var(--color-primary)') : 'rgba(201,162,39,0.3)';

  return (
    <div className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center" style={{ color }}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full">
        <polygon points="11,2 25,2 34,11 34,25 25,34 11,34 2,25 2,11" fill={bg} stroke={border} strokeWidth="1.5" />
      </svg>
      <span className="relative z-10 font-sans text-xs font-bold">
        {done ? '✓' : n}
      </span>
    </div>
  );
}

function StageTracker({ status }) {
  const activeIdx = statusToStageIndex(status);
  return (
    <div className="mb-6">
      <h3 className="font-serif font-semibold text-[var(--color-foreground)] text-sm mb-4">Filing Stages</h3>
      <ol className="flex flex-col gap-4">
        {STAGES.map((stage, i) => {
          const done   = i < activeIdx;
          const active = i === activeIdx;
          return (
            <li key={stage.id} className="flex items-center gap-3">
              <OctagonBadge done={done} active={active} n={i + 1} />
              <span className={`font-sans text-sm ${active ? 'text-[var(--color-foreground)] font-semibold' : done ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-muted)]'}`}>
                {stage.label}
              </span>
              {active && status === 'overdue' && i === 2 && (
                <span className="text-xs font-semibold font-sans px-2 py-0.5 rounded-full" style={{ background: 'var(--color-danger-accent)', color: 'var(--color-danger)' }}>
                  Overdue
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function TrackRTI({ initialId }) {
  const [inputId,   setInputId]   = useState(initialId || '');
  const [record,    setRecord]    = useState(initialId ? getFilingById(initialId) : null);
  const [notFound,  setNotFound]  = useState(false);
  const [simDays,   setSimDays]   = useState(0);

  const handleLookup = () => {
    const found = getFilingById(inputId.trim());
    if (found) {
      setRecord(found);
      setNotFound(false);
      setSimDays(0);
    } else {
      setRecord(null);
      setNotFound(true);
    }
  };

  const displayRecord = simDays > 0 ? simulateDaysPassed(record, simDays) : record;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="font-serif font-bold text-2xl text-[var(--color-foreground)] mb-1">Track My RTI</h2>
      <p className="font-sans text-sm text-[var(--color-muted)] mb-8">Enter your tracking ID to check the status of your RTI filing.</p>

      {/* ID lookup */}
      <div className="flex gap-3 mb-2">
        <input
          type="text"
          value={inputId}
          onChange={e => setInputId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLookup()}
          placeholder="e.g. KP-RTI-2026-A1B21042"
          className="flex-1 font-sans text-sm text-[var(--color-foreground)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]"
        />
        <Button onClick={handleLookup}>Look up</Button>
      </div>

      {notFound && (
        <p className="font-sans text-sm text-[var(--color-danger)] mb-6">No filing found for that ID. Check you're on the same device that filed the request.</p>
      )}

      {record && displayRecord && (
        <div className="mt-8 space-y-6">
          {/* Filing info */}
          <div className="border border-[var(--color-border)] rounded-xl p-5 bg-[var(--color-surface)]">
            <p className="font-sans text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1">Tracking ID</p>
            <p className="font-sans font-bold text-[var(--color-primary)] text-lg mb-4">{record.id}</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm font-sans">
              <div>
                <dt className="text-[10px] uppercase tracking-wide font-semibold text-[var(--color-muted)] mb-0.5">Department</dt>
                <dd className="text-[var(--color-foreground)]">{record.department}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide font-semibold text-[var(--color-muted)] mb-0.5">City</dt>
                <dd className="text-[var(--color-foreground)]">{record.city || '—'}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide font-semibold text-[var(--color-muted)] mb-0.5">Filed</dt>
                <dd className="text-[var(--color-foreground)]">{displayRecord.filedDate}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide font-semibold text-[var(--color-muted)] mb-0.5">Status</dt>
                <dd className={`font-semibold ${record.status === 'answered' ? 'text-[var(--color-success)]' : record.status === 'overdue' ? 'text-[var(--color-danger)]' : 'text-[var(--color-warning)]'}`}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Stage tracker */}
          <div className="border border-[var(--color-border)] rounded-xl p-5 bg-[var(--color-surface)]">
            <StageTracker status={record.status} />
          </div>

          {/* Deadline timer with demo day simulator */}
          <div className="border border-[var(--color-border)] rounded-xl p-5 bg-[var(--color-surface)]">
            <DeadlineTimer filedDate={displayRecord.filedDate} />

            {/* Demo simulator */}
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <p className="font-sans text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2 font-semibold">Demo: simulate days passed</p>
              <div className="flex flex-wrap gap-2">
                {[0, 5, 10, 15].map(d => (
                  <button
                    key={d}
                    onClick={() => setSimDays(d)}
                    className={`font-sans text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      simDays === d
                        ? 'bg-[var(--color-primary)] text-[var(--color-background)] border-[var(--color-primary)]'
                        : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-foreground)]'
                    }`}
                  >
                    {d === 0 ? 'Day 0 (filed)' : `Day ${d}${d === 15 ? ' (overdue)' : ''}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Same-device limitation note */}
          <div
            className="rounded-xl border px-5 py-4"
            style={{ background: 'var(--color-primary-accent)', borderColor: 'rgba(201,162,39,0.3)' }}
          >
            <p className="font-sans text-sm text-[var(--color-foreground)]">
              <span className="font-semibold text-[var(--color-primary)]">Note:</span> Tracking works on the device that filed the request. Cross-device tracking is part of the production roadmap once a shared database is in place.
            </p>
          </div>
        </div>
      )}

      {!record && !notFound && (
        <div className="mt-10 text-center">
          <p className="font-sans text-sm text-[var(--color-muted)]">Enter your tracking ID above to see your filing status and deadline countdown.</p>
        </div>
      )}
    </div>
  );
}
