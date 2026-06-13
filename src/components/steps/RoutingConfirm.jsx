import { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import StatusTag from '../ui/StatusTag.jsx';
import Spinner from '../ui/Spinner.jsx';
import { callClaude } from '../../lib/claude.js';
import { ROUTING_PROMPT } from '../../lib/prompts.js';
import { KP_DEPARTMENTS } from '../../data/departments.js';

const DEPT_KEYS = Object.keys(KP_DEPARTMENTS);

export default function RoutingConfirm({ query, researchSummary, onConfirm, onBack }) {
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [routing, setRouting]     = useState(null);
  const [override, setOverride]   = useState(false);
  const [selected, setSelected]   = useState('');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const userMessage = `Civic question: "${query}"\n\nResearch summary:\n${researchSummary}`;
        const raw = await callClaude({ system: ROUTING_PROMPT, userMessage, maxTokens: 600 });
        const parsed = JSON.parse(raw);
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
        <p className="font-sans text-muted mt-4">Identifying the responsible department...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-danger font-sans mb-4">Routing failed: {error}</p>
        <Button variant="secondary" onClick={onBack}>← Go back</Button>
      </div>
    );
  }

  const dept = KP_DEPARTMENTS[selected];

  const handleConfirm = () => {
    onConfirm({ department: dept, routingReason: routing?.reasoning || '' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="font-sans font-bold text-xl text-foreground mb-1">Responsible Department</h2>
      <p className="text-sm text-muted font-sans mb-6">We've identified the KP department that holds the information you need.</p>

      {routing?.reasoning && (
        <div className="bg-primary_accent rounded-lg p-4 mb-5 border border-nizam_green-100">
          <p className="font-sans text-sm text-foreground"><span className="font-semibold text-primary">Why this department: </span>{routing.reasoning}</p>
        </div>
      )}

      {dept && (
        <Card className="mb-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-sans font-bold text-foreground text-base">{dept.name}</h3>
              <p className="font-sans text-muted text-sm">{dept.ministry}</p>
            </div>
            <StatusTag variant="success">RTI Eligible</StatusTag>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm font-sans">
            <div>
              <dt className="text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">PIO Title</dt>
              <dd className="text-foreground">{dept.pio_title}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">Deadline</dt>
              <dd className="text-foreground">{dept.deadline_working_days} working days</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">Submission Address</dt>
              <dd className="text-foreground">{dept.address}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">Email</dt>
              <dd className="text-foreground">{dept.email}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">Governing Act</dt>
              <dd className="text-foreground">{dept.act_short}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">Escalation Body</dt>
              <dd className="text-foreground">{dept.escalation_body}</dd>
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
          <label className="font-sans text-sm text-foreground font-semibold">Select a different department:</label>
          <select
            className="font-sans text-sm text-foreground bg-surface border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nizam_green-400"
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
