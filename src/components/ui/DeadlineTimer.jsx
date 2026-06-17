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

export default function DeadlineTimer({ filedDate, workingDays = 14 }) {
  if (!filedDate) {
    const estimated = addWorkingDays(new Date(), workingDays);
    return (
      <div className="border border-[var(--color-border)] rounded-xl p-5 mb-6 bg-[var(--color-primary-accent)]">
        <p className="font-sans text-sm text-[var(--color-primary)] font-semibold">
          Once filed: {workingDays} working days · estimated response by {fmt(estimated)}
        </p>
        <p className="font-sans text-xs text-[var(--color-muted)] mt-1">
          Timer starts from the date you submit to the Public Information Officer.
        </p>
      </div>
    );
  }

  const filed    = new Date(filedDate);
  const deadline = addWorkingDays(filed, workingDays);
  const today    = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const calendarDaysLeft = Math.round((deadline - today) / msPerDay);

  let statusColor, statusBg, statusLabel;
  if (calendarDaysLeft > 10) {
    statusColor = 'text-[var(--color-success)]';
    statusBg    = 'bg-[var(--color-success-accent)]';
    statusLabel = 'On Track';
  } else if (calendarDaysLeft >= 1) {
    statusColor = 'text-[var(--color-warning)]';
    statusBg    = 'bg-[var(--color-warning-accent)]';
    statusLabel = 'Due Soon';
  } else {
    statusColor = 'text-[var(--color-danger)]';
    statusBg    = 'bg-[var(--color-danger-accent)]';
    statusLabel = calendarDaysLeft === 0 ? 'Due Today' : 'Overdue';
  }

  return (
    <div className={`border border-[var(--color-border)] rounded-xl p-5 mb-6 ${statusBg}`}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-sans text-xs text-[var(--color-muted)] uppercase tracking-wide font-semibold mb-1">Response Deadline</p>
          <p className={`font-serif text-2xl font-bold ${statusColor}`}>
            {calendarDaysLeft > 0 ? `${calendarDaysLeft} days left` : statusLabel}
          </p>
          <p className="font-sans text-xs text-[var(--color-muted)] mt-1">{fmt(deadline)}</p>
        </div>
        <span className={`text-xs font-semibold font-sans px-3 py-1 rounded-full border ${statusColor} border-current`}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}
