import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import StatusTag from '../ui/StatusTag.jsx';

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

function fmt(date) {
  return date.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

const CHECKLIST = [
  'Print or save the English draft',
  'Print or save the Urdu draft',
  'Submit to the PIO by post or email',
  'Note your deadline date',
  'Follow up with the KP Information Commission if no response arrives',
];

export default function SubmissionGuide({ department, filedDate, onReset }) {
  const filed    = filedDate ? new Date(filedDate) : new Date();
  const deadline = addWorkingDays(filed, 14);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-sans font-bold text-xl text-foreground">Submission Guide</h2>
        <StatusTag variant="success">Ready to file</StatusTag>
      </div>

      <Card className="mb-5">
        <h3 className="font-sans font-semibold text-foreground text-base mb-4">Where to Submit</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm font-sans">
          <div>
            <dt className="text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">Department</dt>
            <dd className="text-foreground">{department?.name}</dd>
          </div>
          <div>
            <dt className="text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">PIO</dt>
            <dd className="text-foreground">{department?.pio_title}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">Postal Address</dt>
            <dd className="text-foreground">{department?.address}</dd>
          </div>
          <div>
            <dt className="text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">Email</dt>
            <dd className="text-foreground">{department?.email}</dd>
          </div>
          <div>
            <dt className="text-muted text-xs uppercase tracking-wide font-semibold mb-0.5">Fee</dt>
            <dd className="text-foreground">{department?.fee_per_page} per photocopied page</dd>
          </div>
        </dl>
      </Card>

      <Card className="mb-5 border-warning border">
        <h3 className="font-sans font-semibold text-foreground text-base mb-4">Timeline</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-primary_accent rounded-lg p-4">
            <p className="font-sans text-xs text-muted uppercase tracking-wide font-semibold mb-1">Filing Date</p>
            <p className="font-sans text-sm font-semibold text-foreground">{fmt(filed)}</p>
          </div>
          <div className="flex-1 bg-warning_accent rounded-lg p-4">
            <p className="font-sans text-xs text-muted uppercase tracking-wide font-semibold mb-1">Response Deadline (14 working days)</p>
            <p className="font-sans text-sm font-semibold text-foreground">{fmt(deadline)}</p>
          </div>
        </div>
      </Card>

      <Card className="mb-5">
        <h3 className="font-sans font-semibold text-foreground text-base mb-4">Escalation Path</h3>
        <p className="font-sans text-sm text-foreground mb-2">
          If no response is received by <strong>{fmt(deadline)}</strong>, you may appeal to:
        </p>
        <p className="font-sans text-sm font-semibold text-foreground">{department?.escalation_body}</p>
        <p className="font-sans text-sm text-muted">{department?.escalation_address}</p>
        <p className="font-sans text-xs text-muted mt-3">Under Section 15 of the KP RTI Act 2013, you have 30 days from the deadline to file your appeal.</p>
      </Card>

      <Card className="mb-6">
        <h3 className="font-sans font-semibold text-foreground text-base mb-3">Filing Checklist</h3>
        <ul className="space-y-2">
          {CHECKLIST.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 w-5 h-5 rounded border-2 border-nizam_green-400 flex-shrink-0" />
              <span className="font-sans text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Button onClick={onReset}>Start a new RTI →</Button>
    </div>
  );
}
