import { useState } from 'react';
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

export default function SubmissionGuide({ department, filedDate, draftEn, subjectEn, onReset }) {
  const [checked, setChecked] = useState(CHECKLIST.map(() => false));

  const filed    = filedDate ? new Date(filedDate) : new Date();
  const deadline = addWorkingDays(filed, 14);
  const DeptIcon = department?.icon ? ICON_COMPONENTS[department.icon] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-serif font-bold text-xl text-[var(--color-foreground)]">Submission Guide</h2>
        <StatusTag variant="success">Ready to file</StatusTag>
      </div>

      {/* Where to Submit */}
      <Card className="mb-5">
        <div className="flex items-center gap-3 mb-4">
          {DeptIcon && (
            <div className="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-primary-accent)] flex items-center justify-center flex-shrink-0">
              <DeptIcon className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
          )}
          <h3 className="font-serif font-semibold text-[var(--color-foreground)] text-base">Where to Submit</h3>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm font-sans">
          <div>
            <dt className="text-[var(--color-muted)] text-xs uppercase tracking-wide font-semibold mb-0.5">Department</dt>
            <dd className="text-[var(--color-foreground)]">{department?.name}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-muted)] text-xs uppercase tracking-wide font-semibold mb-0.5">PIO</dt>
            <dd className="text-[var(--color-foreground)]">{department?.pio_title}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[var(--color-muted)] text-xs uppercase tracking-wide font-semibold mb-0.5">Postal Address</dt>
            <dd className="text-[var(--color-foreground)]">{department?.address}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-muted)] text-xs uppercase tracking-wide font-semibold mb-0.5">Email</dt>
            <dd className="text-[var(--color-foreground)]">{department?.email}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-muted)] text-xs uppercase tracking-wide font-semibold mb-0.5">Fee</dt>
            <dd className="text-[var(--color-foreground)]">{department?.fee_per_page} per photocopied page</dd>
          </div>
        </dl>
      </Card>

      {/* Deadline timer (live, with filedDate) */}
      <DeadlineTimer filedDate={filedDate || new Date().toISOString()} />

      {/* Escalation Path */}
      <Card className="mb-5">
        <h3 className="font-serif font-semibold text-[var(--color-foreground)] text-base mb-4">Escalation Path</h3>
        <p className="font-sans text-sm text-[var(--color-foreground)] mb-2">
          If no response is received by the deadline, you may appeal to:
        </p>
        <p className="font-sans text-sm font-semibold text-[var(--color-foreground)]">{department?.escalation_body}</p>
        <p className="font-sans text-sm text-[var(--color-muted)]">{department?.escalation_address}</p>
        <p className="font-sans text-xs text-[var(--color-muted)] mt-3">Under Section 15 of the KP RTI Act 2013, you have 30 days from the deadline to file your appeal.</p>
      </Card>

      {/* Filing Checklist — real checkboxes */}
      <Card className="mb-5">
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

      {/* Tracker toggle */}
      <TrackerToggle department={department} filedDate={filedDate} />

      {/* Share buttons */}
      <ShareButton
        subjectEn={subjectEn}
        department={department}
        deadline={deadline.toISOString()}
      />

      <div className="mt-6">
        <Button onClick={onReset}>Start a new RTI →</Button>
      </div>
    </div>
  );
}
