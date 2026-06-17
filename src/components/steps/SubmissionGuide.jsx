import { useState, useEffect } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import StatusTag from '../ui/StatusTag.jsx';
import DeadlineTimer from '../ui/DeadlineTimer.jsx';
import TrackerToggle from '../ui/TrackerToggle.jsx';
import ShareButton from '../ui/ShareButton.jsx';
import IconBook from '../icons/IconBook.jsx';
import IconCross from '../icons/IconCross.jsx';
import IconBridge from '../icons/IconBridge.jsx';
import IconCoin from '../icons/IconCoin.jsx';
import IconWheat from '../icons/IconWheat.jsx';
import IconDroplet from '../icons/IconDroplet.jsx';
import IconShield from '../icons/IconShield.jsx';
import IconTownHall from '../icons/IconTownHall.jsx';
import IconBolt from '../icons/IconBolt.jsx';
import IconTree from '../icons/IconTree.jsx';
import { generateTrackingId, saveFilingRecord } from '../../lib/rtiTracker.js';

const ICON_COMPONENTS = {
  IconBook, IconCross, IconBridge, IconCoin, IconWheat,
  IconDroplet, IconShield, IconTownHall, IconBolt, IconTree,
};

function addWorkingDays(date, days) {
  const d = new Date(date);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

const CHECKLIST = [
  'Print or save the English draft',
  'Print or save the Urdu draft',
  'Submit to the PIO by post or email',
  'Note your deadline date',
  'Follow up with the KP Information Commission if no response arrives',
];

export default function SubmissionGuide({ department, filedDate, draftEn, subjectEn, onReset, onFilingComplete, onGoToTrack }) {
  const [checked,    setChecked]    = useState(CHECKLIST.map(() => false));
  const [trackingId, setTrackingId] = useState('');

  const filed    = filedDate ? new Date(filedDate) : new Date();
  const deadline = addWorkingDays(filed, 14);
  const DeptIcon = department?.icon ? ICON_COMPONENTS[department.icon] : null;

  useEffect(() => {
    const id = generateTrackingId();
    setTrackingId(id);
    saveFilingRecord({
      id,
      citizenLabel: `Citizen #${Math.floor(Math.random() * 9000) + 1000}`,
      department:   department?.name?.split(' ')[0] || 'Unknown',
      city:         'Peshawar',
      partyOfOrigin: 'PTI',
      filedDate:    new Date(filed).toISOString().slice(0, 10),
      status:       'pending',
      responseDate: null,
    });
    if (onFilingComplete) onFilingComplete(id);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-serif font-bold text-xl text-[var(--color-foreground)]">Submission Guide</h2>
        <StatusTag variant="success">Ready to file</StatusTag>
      </div>

      {/* ── Zone 1: Status ── */}
      <section className="mb-6">
        {/* Tracking ID banner */}
        {trackingId && (
          <div
            className="rounded-xl border px-6 py-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ background: 'var(--color-primary-accent)', borderColor: 'var(--color-primary)' }}
          >
            <div className="flex-1">
              <p className="font-sans text-xs uppercase tracking-wider font-semibold text-[var(--color-primary)] mb-1">Your RTI Tracking ID</p>
              <p className="font-serif font-bold text-[var(--color-foreground)] text-xl">{trackingId}</p>
              <p className="font-sans text-xs text-[var(--color-muted)] mt-1">Save this ID to check the status of your filing.</p>
            </div>
            {onGoToTrack && (
              <Button variant="secondary" onClick={onGoToTrack} className="flex-shrink-0 text-sm">
                Track My RTI →
              </Button>
            )}
          </div>
        )}
        <DeadlineTimer filedDate={filedDate || new Date().toISOString()} />
        <div className="mt-3">
          <TrackerToggle department={department} filedDate={filedDate} />
        </div>
      </section>

      {/* ── Zone 2: Case Summary ── */}
      <section className="mb-6">
        <Card>
          <h3 className="font-serif font-semibold text-[var(--color-foreground)] text-base mb-5">Case Summary</h3>

          {/* Stamped-letter style submission details */}
          <div
            className="rounded-xl border border-dashed border-[var(--color-primary)]/40 p-5 mb-5 relative"
            style={{ background: 'rgba(201,162,39,0.04)' }}
          >
            <div
              className="absolute -top-4 right-6 w-8 h-8 rounded-full border-2 border-[var(--color-primary)]/60 flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--color-primary)', color: 'var(--color-background)' }}
            >
              ✉
            </div>
            <div className="flex items-center gap-3 mb-3">
              {DeptIcon && (
                <div className="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-primary-accent)] flex items-center justify-center flex-shrink-0">
                  <DeptIcon className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
              )}
              <div>
                <p className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Submit to</p>
                <p className="font-serif font-bold text-[var(--color-foreground)] text-base leading-snug">{department?.pio_title}</p>
              </div>
            </div>
            <p className="font-sans font-semibold text-[var(--color-foreground)] text-sm">{department?.name}</p>
            <p className="font-sans text-sm text-[var(--color-muted)] mt-1">{department?.address}</p>
            {department?.email && (
              <p className="font-sans text-sm text-[var(--color-primary)] mt-2">{department.email}</p>
            )}
            <p className="font-sans text-xs text-[var(--color-muted)] mt-2">Fee: {department?.fee_per_page} per photocopied page</p>
          </div>

          {/* Escalation path — merged into same card */}
          <div className="border-t border-[var(--color-border)] pt-4">
            <h4 className="font-sans text-xs uppercase tracking-wide font-semibold text-[var(--color-muted)] mb-2">If No Response by Deadline</h4>
            <p className="font-sans text-sm text-[var(--color-foreground)] font-semibold">{department?.escalation_body}</p>
            <p className="font-sans text-sm text-[var(--color-muted)]">{department?.escalation_address}</p>
            <p className="font-sans text-xs text-[var(--color-muted)] mt-2">Under Section 15 of the KP RTI Act 2013, you have 30 days from the deadline to file your appeal.</p>
          </div>
        </Card>
      </section>

      {/* ── Zone 3: Checklist + Share ── */}
      <section className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <h3 className="font-serif font-semibold text-[var(--color-foreground)] text-base mb-3">Filing Checklist</h3>
            <ul className="space-y-2">
              {CHECKLIST.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`check-${i}`}
                    checked={checked[i]}
                    onChange={() => {
                      const next = [...checked];
                      next[i] = !next[i];
                      setChecked(next);
                    }}
                    className="mt-0.5 w-4 h-4 flex-shrink-0 rounded border-2 border-[var(--color-primary)] bg-transparent checked:bg-[var(--color-primary)] accent-[var(--color-primary)] cursor-pointer"
                  />
                  <label htmlFor={`check-${i}`} className="font-sans text-sm text-[var(--color-foreground)] cursor-pointer">
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex flex-col gap-4">
            <ShareButton
              subjectEn={subjectEn}
              department={department}
              deadline={deadline.toISOString()}
            />
          </div>
        </div>
      </section>

      <Button onClick={onReset}>Start a new RTI →</Button>
    </div>
  );
}
