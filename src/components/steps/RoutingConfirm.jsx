import { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import StatusTag from '../ui/StatusTag.jsx';
import Spinner from '../ui/Spinner.jsx';
import ComplianceIndicator from '../ui/ComplianceIndicator.jsx';
import { callClaude, extractJSON } from '../../lib/claude.js';
import { ROUTING_PROMPT } from '../../lib/prompts.js';
import { KP_DEPARTMENTS } from '../../data/departments.js';
import { DEMO_RESPONSES } from '../../data/demo-responses.js';
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
import IconClock from '../icons/IconClock.jsx';

const ICON_COMPONENTS = {
  IconBook, IconCross, IconBridge, IconCoin, IconWheat,
  IconDroplet, IconShield, IconTownHall, IconBolt, IconTree,
};

const DEPT_KEYS = Object.keys(KP_DEPARTMENTS);

export default function RoutingConfirm({ query, researchSummary, onConfirm, onBack }) {
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [routing, setRouting]   = useState(null);
  const [override, setOverride] = useState(false);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        await new Promise(r => setTimeout(r, 700));
        if (cancelled) return;

        const demo   = DEMO_RESPONSES[query];
        const parsed = demo
          ? demo.routing
          : extractJSON(await callClaude({ system: ROUTING_PROMPT, userMessage: `Civic question: "${query}"\n\nResearch summary:\n${researchSummary}`, maxTokens: 600 }));

        if (!cancelled) {
          setRouting(parsed);
          setSelected(parsed.department_key);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [query, researchSummary]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Spinner size="lg" />
        <p className="font-sans text-[var(--color-muted)] mt-4">Identifying the responsible department...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-[var(--color-danger)] font-sans mb-4">Routing failed: {error}</p>
        <Button variant="secondary" onClick={onBack}>← Go back</Button>
      </div>
    );
  }

  const dept = KP_DEPARTMENTS[selected];
  const DeptIcon = dept?.icon ? ICON_COMPONENTS[dept.icon] : null;

  const handleConfirm = () => {
    onConfirm({ department: dept, routingReason: routing?.reasoning || '' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="font-serif font-bold text-xl text-[var(--color-foreground)] mb-1">Responsible Department</h2>
      <p className="text-sm text-[var(--color-muted)] font-sans mb-6">We've identified the KP department that holds the information you need.</p>

      {routing?.reasoning && (
        <div
          className="rounded-lg p-4 mb-5 border"
          style={{ background: 'var(--color-primary-accent)', borderColor: 'rgba(201,162,39,0.3)' }}
        >
          <p className="font-sans text-sm text-[var(--color-foreground)]">
            <span className="font-semibold text-[var(--color-primary)]">Why this department: </span>{routing.reasoning}
          </p>
        </div>
      )}

      {dept && (
        <Card className="mb-5">
          {/* Header row with icon badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {DeptIcon && (
                <div className="w-10 h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-primary-accent)] flex items-center justify-center flex-shrink-0">
                  <DeptIcon className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
              )}
              <div>
                <h3 className="font-serif font-bold text-[var(--color-foreground)] text-base">{dept.name}</h3>
                <p className="font-sans text-[var(--color-muted)] text-sm">{dept.ministry}</p>
              </div>
            </div>
            <StatusTag variant="success">RTI Eligible</StatusTag>
          </div>

          {/* Compliance indicator — visible by default */}
          <div className="mb-4">
            <ComplianceIndicator rating={dept.compliance} note={dept.compliance_note} />
          </div>

          {/* Icon-stat row for Deadline and Fee */}
          <div className="flex items-center gap-6 mb-4 pb-4 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2 text-sm font-sans text-[var(--color-foreground)]">
              <IconClock className="w-4 h-4 text-[var(--color-primary)]" />
              <span>{dept.deadline_working_days} working days</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-sans text-[var(--color-foreground)]">
              <IconCoin className="w-4 h-4 text-[var(--color-primary)]" />
              <span>{dept.fee_per_page} per page</span>
            </div>
          </div>

          {/* Other department details */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm font-sans">
            <div>
              <dt className="text-[var(--color-muted)] text-xs uppercase tracking-wide font-semibold mb-0.5">PIO Title</dt>
              <dd className="text-[var(--color-foreground)]">{dept.pio_title}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)] text-xs uppercase tracking-wide font-semibold mb-0.5">Submission Address</dt>
              <dd className="text-[var(--color-foreground)]">{dept.address}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)] text-xs uppercase tracking-wide font-semibold mb-0.5">Email</dt>
              <dd className="text-[var(--color-foreground)]">{dept.email}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)] text-xs uppercase tracking-wide font-semibold mb-0.5">Governing Act</dt>
              <dd className="text-[var(--color-foreground)]">{dept.act_short}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[var(--color-muted)] text-xs uppercase tracking-wide font-semibold mb-0.5">Escalation Body</dt>
              <dd className="text-[var(--color-foreground)]">{dept.escalation_body}</dd>
            </div>
          </dl>
        </Card>
      )}

      {!override ? (
        <div className="flex items-center gap-4">
          <Button onClick={handleConfirm}>Confirm department →</Button>
          <Button variant="ghost" onClick={() => setOverride(true)}>Choose different department</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <label className="font-sans text-sm text-[var(--color-foreground)] font-semibold">Select a different department:</label>
          <select
            className="font-sans text-sm text-[var(--color-foreground)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={selected}
            onChange={e => setSelected(e.target.value)}
          >
            {DEPT_KEYS.map(k => <option key={k} value={k}>{k} — {KP_DEPARTMENTS[k].name}</option>)}
          </select>
          <div className="flex gap-3">
            <Button onClick={handleConfirm}>Confirm selection →</Button>
            <Button variant="secondary" onClick={() => { setOverride(false); setSelected(routing?.department_key || ''); }}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
