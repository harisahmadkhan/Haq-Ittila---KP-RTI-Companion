import IconWhatsApp from '../icons/IconWhatsApp.jsx';
import IconMail from '../icons/IconMail.jsx';

export default function ShareButton({ subjectEn, department, deadline }) {
  const deptName = department?.name || 'KP Government Department';
  const deadlineStr = deadline
    ? new Date(deadline).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'within 14 working days';

  const summary = [
    `RTI Filed: ${subjectEn || 'Right to Information Request'}`,
    `Department: ${deptName}`,
    `Response Deadline: ${deadlineStr}`,
    `Filed under: KP Right to Information Act 2013`,
  ].join('\n');

  const waUrl = `https://wa.me/?text=${encodeURIComponent(summary)}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(subjectEn || 'RTI Filed')}&body=${encodeURIComponent(summary)}`;

  return (
    <div className="flex gap-3 flex-wrap mt-4">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-4 py-2 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-accent)] transition-colors"
      >
        <IconWhatsApp className="w-4 h-4" />
        Share on WhatsApp
      </a>
      <a
        href={mailUrl}
        className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
      >
        <IconMail className="w-4 h-4" />
        Share via Email
      </a>
    </div>
  );
}
