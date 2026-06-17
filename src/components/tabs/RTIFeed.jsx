import { useState, useMemo } from 'react';
import { getAllLocalAndSeededRecords } from '../../lib/rtiTracker.js';

const DEPARTMENTS = ['Education', 'Health', 'Infrastructure', 'Agriculture', 'Finance', 'Water & Sanitation', 'Police', 'Local Government', 'Energy', 'Forestry'];
const CITIES      = ['Peshawar', 'Mardan', 'Swat', 'Abbottabad', 'Kohat', 'Bannu', 'D.I. Khan', 'Charsadda', 'Nowshera', 'Swabi'];
const PARTIES     = ['PTI', 'ANP', 'JUI-F', 'PML-N', 'PPP'];

function timeAgo(dateStr) {
  const then = new Date(dateStr);
  const now  = new Date();
  const diff = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'today';
  if (diff === 1) return '1 day ago';
  if (diff < 30)  return `${diff} days ago`;
  const months = Math.floor(diff / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[var(--color-muted)]">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="font-sans text-sm text-[var(--color-foreground)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      >
        <option value="">All</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function BigStat({ value, label, accent }) {
  return (
    <div className="border border-[var(--color-border)] rounded-xl p-5 text-center bg-[var(--color-surface)]">
      <p className="font-serif text-3xl font-bold mb-1" style={{ color: accent || 'var(--color-primary)' }}>{value}</p>
      <p className="font-sans text-xs text-[var(--color-muted)] uppercase tracking-wide">{label}</p>
    </div>
  );
}

// Simple SVG bar chart — no library
function TrendChart({ records }) {
  const months = {};
  records.forEach(r => {
    const m = r.filedDate.slice(0, 7);
    months[m] = (months[m] || 0) + 1;
  });
  const sorted = Object.entries(months).sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  if (!sorted.length) return null;
  const max = Math.max(...sorted.map(([, v]) => v), 1);
  const W = 420, H = 100, BAR_W = 40, GAP = 22;

  return (
    <div className="border border-[var(--color-border)] rounded-xl p-5 bg-[var(--color-surface)]">
      <h3 className="font-serif font-semibold text-[var(--color-foreground)] text-sm mb-4">RTIs Filed Per Month</h3>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full" style={{ minWidth: 280 }}>
          {sorted.map(([month, count], i) => {
            const barH  = Math.round((count / max) * H);
            const x     = i * (BAR_W + GAP) + 10;
            const y     = H - barH;
            const label = month.slice(5); // MM
            return (
              <g key={month}>
                <rect x={x} y={y} width={BAR_W} height={barH} rx="4" fill="var(--color-primary)" opacity="0.8" />
                <text x={x + BAR_W / 2} y={H + 14} textAnchor="middle" fontSize="9" fill="var(--color-muted)" fontFamily="sans-serif">{label}</text>
                <text x={x + BAR_W / 2} y={y - 4}  textAnchor="middle" fontSize="9" fill="var(--color-foreground)" fontFamily="sans-serif" fontWeight="600">{count}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default function RTIFeed() {
  const [deptFilter,  setDeptFilter]  = useState('');
  const [cityFilter,  setCityFilter]  = useState('');
  const [partyFilter, setPartyFilter] = useState('');

  const all = useMemo(() => getAllLocalAndSeededRecords(), []);

  const filtered = useMemo(() => all.filter(r =>
    (!deptFilter  || r.department === deptFilter) &&
    (!cityFilter  || r.city        === cityFilter) &&
    (!partyFilter || r.partyOfOrigin === partyFilter)
  ), [all, deptFilter, cityFilter, partyFilter]);

  const answered  = filtered.filter(r => r.status === 'answered').length;
  const overdue   = filtered.filter(r => r.status === 'overdue').length;
  const inProcess = filtered.filter(r => r.status === 'pending').length;
  const rate      = filtered.length ? Math.round((answered / filtered.length) * 100) : 0;

  // Department leaderboard
  const deptStats = useMemo(() => {
    const map = {};
    filtered.forEach(r => {
      if (!map[r.department]) map[r.department] = { total: 0, answered: 0 };
      map[r.department].total++;
      if (r.status === 'answered') map[r.department].answered++;
    });
    return Object.entries(map)
      .map(([dept, { total, answered }]) => ({ dept, total, answered, pct: total ? Math.round((answered / total) * 100) : 0 }))
      .sort((a, b) => b.pct - a.pct);
  }, [filtered]);

  const recent = filtered.slice(0, 15);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Vision preview label */}
      <div
        className="flex items-center gap-3 rounded-xl border px-5 py-3 mb-8"
        style={{ background: 'var(--color-warning-accent)', borderColor: 'var(--color-warning)' }}
      >
        <span className="text-[var(--color-warning)] font-bold text-lg">⚠</span>
        <p className="font-sans text-sm text-[var(--color-foreground)]">
          <span className="font-semibold">Vision Preview</span> — illustrative data, shown as it will appear once the KP Information Commission hosts a live shared database. No real filings are displayed here.
        </p>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Select label="Department"      value={deptFilter}  onChange={setDeptFilter}  options={DEPARTMENTS} />
        <Select label="City"            value={cityFilter}  onChange={setCityFilter}  options={CITIES} />
        <Select label="Party of Origin" value={partyFilter} onChange={setPartyFilter} options={PARTIES} />
      </div>

      {/* Summary tracker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <BigStat value={filtered.length} label="Total Received" />
        <BigStat value={answered}        label="Answered" accent="var(--color-success)" />
        <BigStat value={inProcess}       label="In Process" accent="var(--color-warning)" />
        <BigStat value={`${rate}%`}      label="Success Rate" />
      </div>

      {/* Overdue counter */}
      <div
        className="flex items-center gap-4 rounded-xl border px-6 py-4 mb-8"
        style={{ background: 'var(--color-danger-accent)', borderColor: 'var(--color-danger)' }}
      >
        <p className="font-serif text-4xl font-bold" style={{ color: 'var(--color-danger)' }}>{overdue}</p>
        <div>
          <p className="font-sans font-semibold text-[var(--color-foreground)]">Currently Overdue</p>
          <p className="font-sans text-xs text-[var(--color-muted)]">No response received past the 14 working-day deadline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recently filed feed */}
        <div className="border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h3 className="font-serif font-semibold text-[var(--color-foreground)]">Recently Filed</h3>
          </div>
          <ul className="divide-y divide-[var(--color-border)] max-h-80 overflow-y-auto">
            {recent.map(r => (
              <li key={r.id} className="px-5 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-sans text-sm text-[var(--color-foreground)] truncate">
                    <span className="font-medium">{r.citizenLabel}</span> filed an RTI to <span className="text-[var(--color-primary)] font-medium">{r.department}</span> Dept
                  </p>
                  <p className="font-sans text-xs text-[var(--color-muted)]">{r.city} · {r.partyOfOrigin} promise · {timeAgo(r.filedDate)}</p>
                </div>
                <span
                  className="text-[10px] font-semibold font-sans px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                  style={
                    r.status === 'answered' ? { background: 'var(--color-success-accent)', color: 'var(--color-success)' } :
                    r.status === 'overdue'  ? { background: 'var(--color-danger-accent)',  color: 'var(--color-danger)'  } :
                                              { background: 'var(--color-warning-accent)', color: 'var(--color-warning)' }
                  }
                >
                  {r.status}
                </span>
              </li>
            ))}
            {recent.length === 0 && (
              <li className="px-5 py-8 text-center">
                <p className="font-sans text-sm text-[var(--color-muted)]">No records match the current filters.</p>
              </li>
            )}
          </ul>
        </div>

        {/* Department leaderboard */}
        <div className="border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h3 className="font-serif font-semibold text-[var(--color-foreground)]">Department Leaderboard</h3>
            <p className="font-sans text-xs text-[var(--color-muted)]">By response rate (answered ÷ received)</p>
          </div>
          <ul className="divide-y divide-[var(--color-border)] max-h-80 overflow-y-auto">
            {deptStats.map((d, i) => (
              <li key={d.dept} className="px-5 py-3 flex items-center gap-3">
                <span className={`font-serif font-bold text-sm w-5 flex-shrink-0 ${i === 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-sans text-sm text-[var(--color-foreground)] truncate">{d.dept}</p>
                    <p className="font-sans text-xs font-semibold text-[var(--color-primary)] ml-2 flex-shrink-0">{d.pct}%</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--color-primary-accent)] overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--color-primary)] transition-all" style={{ width: `${d.pct}%` }} />
                  </div>
                  <p className="font-sans text-[10px] text-[var(--color-muted)] mt-0.5">{d.answered}/{d.total} answered</p>
                </div>
              </li>
            ))}
            {deptStats.length === 0 && (
              <li className="px-5 py-8 text-center">
                <p className="font-sans text-sm text-[var(--color-muted)]">No data for current filters.</p>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Trend chart */}
      <TrendChart records={filtered} />
    </div>
  );
}
