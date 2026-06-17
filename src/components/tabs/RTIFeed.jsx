import { useState, useMemo, useEffect, useRef } from 'react';
import { getAllLocalAndSeededRecords } from '../../lib/rtiTracker.js';

const DEPARTMENTS = ['Education', 'Health', 'Infrastructure', 'Agriculture', 'Finance', 'Water & Sanitation', 'Police', 'Local Government', 'Energy', 'Forestry'];
const CITIES      = ['Peshawar', 'Mardan', 'Swat', 'Abbottabad', 'Kohat', 'Bannu', 'D.I. Khan', 'Charsadda', 'Nowshera', 'Swabi'];
const PARTIES     = ['PTI', 'ANP', 'JUI-F', 'PML-N', 'PPP'];

const PARTY_WEIGHTS = { PTI: 4, ANP: 2, 'JUI-F': 2, 'PML-N': 1, PPP: 1 };
function weightedParty() {
  const pool = PARTIES.flatMap(p => Array(PARTY_WEIGHTS[p]).fill(p));
  return pool[Math.floor(Math.random() * pool.length)];
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function fakeId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `KP-RTI-2026-${s}${String(Math.floor(Math.random() * 9000) + 1000)}`;
}
function fakeCitizen() { return `Citizen #${Math.floor(Math.random() * 9000) + 1000}`; }

// Inline sparkline
function Sparkline({ records }) {
  const months = {};
  records.forEach(r => {
    const m = r.filedDate?.slice(0, 7);
    if (m) months[m] = (months[m] || 0) + 1;
  });
  const sorted = Object.entries(months).sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  if (!sorted.length) return null;
  const max = Math.max(...sorted.map(([, v]) => v), 1);

  return (
    <div className="flex items-end gap-1.5 h-8">
      {sorted.map(([month, count]) => (
        <div key={month} className="flex flex-col items-center gap-0.5 flex-1">
          <div
            className="w-full rounded-sm transition-all duration-700"
            style={{
              height: `${Math.max(4, Math.round((count / max) * 28))}px`,
              background: 'var(--color-primary)',
              opacity: 0.7 + 0.3 * (count / max),
            }}
          />
          <span className="text-[8px] font-sans text-[var(--color-muted)] leading-none">{month.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

// Animated number — flashes gold on change
function LiveNumber({ value, color, className }) {
  const [display, setDisplay] = useState(value);
  const [flash,   setFlash]   = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (value !== prev.current) {
      setFlash(true);
      setDisplay(value);
      prev.current = value;
      setTimeout(() => setFlash(false), 600);
    }
  }, [value]);

  return (
    <span
      className={className}
      style={{ color: flash ? 'var(--color-primary)' : (color || 'var(--color-foreground)'), transition: 'color 0.4s' }}
    >
      {display}
    </span>
  );
}

function StatusPill({ status }) {
  const styles = {
    answered: { bg: 'var(--color-success-accent)', color: 'var(--color-success)' },
    overdue:  { bg: 'var(--color-danger-accent)',  color: 'var(--color-danger)'  },
    pending:  { bg: 'var(--color-warning-accent)', color: 'var(--color-warning)' },
  };
  const s = styles[status] || styles.pending;
  return (
    <span className="text-[10px] font-semibold font-sans px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

export default function RTIFeed() {
  const [deptFilter,  setDeptFilter]  = useState('');
  const [cityFilter,  setCityFilter]  = useState('');
  const [partyFilter, setPartyFilter] = useState('');
  const [liveItems,   setLiveItems]   = useState([]);
  const [pulse,       setPulse]       = useState(false);

  const seed = useMemo(() => getAllLocalAndSeededRecords(), []);

  const all = useMemo(() => {
    return [...liveItems, ...seed];
  }, [seed, liveItems]);

  const filtered = useMemo(() => all.filter(r =>
    (!deptFilter  || r.department    === deptFilter) &&
    (!cityFilter  || r.city          === cityFilter) &&
    (!partyFilter || r.partyOfOrigin === partyFilter)
  ), [all, deptFilter, cityFilter, partyFilter]);

  const answered  = filtered.filter(r => r.status === 'answered').length;
  const overdue   = filtered.filter(r => r.status === 'overdue').length;
  const inProcess = filtered.filter(r => r.status === 'pending').length;
  const rate      = filtered.length ? Math.round((answered / filtered.length) * 100) : 0;

  const deptStats = useMemo(() => {
    const map = {};
    filtered.forEach(r => {
      if (!map[r.department]) map[r.department] = { total: 0, answered: 0 };
      map[r.department].total++;
      if (r.status === 'answered') map[r.department].answered++;
    });
    return Object.entries(map)
      .map(([dept, s]) => ({ dept, total: s.total, answered: s.answered, pct: s.total ? Math.round((s.answered / s.total) * 100) : 0 }))
      .sort((a, b) => b.pct - a.pct);
  }, [filtered]);

  // Simulated live filings
  useEffect(() => {
    const tick = () => {
      const dept   = pick(DEPARTMENTS);
      const city   = pick(CITIES);
      const party  = weightedParty();
      const status = Math.random() < 0.5 ? 'pending' : Math.random() < 0.7 ? 'answered' : 'overdue';
      const newRec = {
        id:             fakeId(),
        citizenLabel:   fakeCitizen(),
        department:     dept,
        city,
        partyOfOrigin:  party,
        filedDate:      new Date().toISOString().slice(0, 10),
        status,
        responseDate:   status === 'answered' ? new Date().toISOString().slice(0, 10) : null,
        _live:          true,
      };
      setLiveItems(prev => [newRec, ...prev].slice(0, 40));
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    };

    const first   = setTimeout(tick, 1800);
    const interval = setInterval(tick, 4500);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  const recentFeed = [...liveItems, ...seed].slice(0, 24);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Vision Preview — compact strip */}
      <div className="flex items-center gap-2 text-xs font-sans text-[var(--color-muted)] mb-5 px-1">
        <span className="text-[var(--color-warning)]">⚠</span>
        <span><span className="font-semibold text-[var(--color-foreground)]">Vision Preview</span> — illustrative data, shown as it will appear once the KP Information Commission hosts a live shared database.</span>
      </div>

      {/* Dark hero stats band */}
      <div
        className="rounded-2xl px-6 py-5 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #061610 0%, #0B2417 60%, #0f2e1e 100%)' }}
      >
        <div className="absolute top-4 right-5 flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: 'var(--color-primary)',
              boxShadow: pulse ? '0 0 0 4px rgba(0,172,72,0.3)' : 'none',
              transition: 'box-shadow 0.3s',
            }}
          />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">DEMO</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Total Received', value: filtered.length, color: 'var(--color-primary)' },
            { label: 'Answered',       value: answered,        color: 'var(--color-success)' },
            { label: 'In Process',     value: inProcess,       color: 'var(--color-warning)' },
            { label: 'Success Rate',   value: `${rate}%`,      color: 'var(--color-foreground)' },
          ].map(s => (
            <div key={s.label}>
              <LiveNumber value={s.value} color={s.color} className="font-serif text-4xl font-bold block" />
              <p className="font-sans text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(245,243,238,0.45)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between gap-6 pt-4 border-t border-white/10">
          <div className="flex items-baseline gap-2">
            <LiveNumber value={overdue} color="var(--color-danger)" className="font-serif text-2xl font-bold" />
            <span className="font-sans text-xs text-[var(--color-muted)]">currently overdue · past 14-day deadline</span>
          </div>
          <div className="w-40 flex-shrink-0">
            <p className="font-sans text-[9px] uppercase tracking-wider text-[var(--color-muted)] mb-1">Filed / month</p>
            <Sparkline records={filtered} />
          </div>
        </div>
      </div>

      {/* Full-width Activity Feed Card */}
      <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)] mb-6">

        {/* Feed header with filters integrated */}
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif font-semibold text-[var(--color-foreground)] text-base">Live Activity Feed</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" style={{ animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
              <span className="font-sans text-[10px] text-[var(--color-muted)] uppercase tracking-wide">Updating</span>
            </div>
          </div>

          {/* Inline filter row */}
          <div className="flex flex-wrap gap-2.5 items-center">
            <span className="font-sans text-[10px] text-[var(--color-muted)] font-semibold uppercase tracking-wider">Filter:</span>
            {[
              { label: 'Department', value: deptFilter,  onChange: setDeptFilter,  options: DEPARTMENTS },
              { label: 'City',       value: cityFilter,  onChange: setCityFilter,  options: CITIES },
              { label: 'Party',      value: partyFilter, onChange: setPartyFilter, options: PARTIES },
            ].map(f => (
              <select
                key={f.label}
                value={f.value}
                onChange={e => f.onChange(e.target.value)}
                className="font-sans text-[11px] text-[var(--color-foreground)] bg-[var(--color-background)] border border-[var(--color-border)] rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                <option value="">All {f.label}</option>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
            {(deptFilter || cityFilter || partyFilter) && (
              <button
                onClick={() => { setDeptFilter(''); setCityFilter(''); setPartyFilter(''); }}
                className="font-sans text-[10px] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                Clear ×
              </button>
            )}
          </div>
        </div>

        {/* Feed list — tall scrollable area */}
        <ul className="divide-y divide-[var(--color-border)]" style={{ maxHeight: 480, overflowY: 'auto' }}>
          {recentFeed.map((r, i) => (
            <li
              key={r.id}
              className="px-5 py-3 flex items-center justify-between gap-3 transition-colors hover:bg-[rgba(0,172,72,0.02)]"
              style={{
                background: r._live && i === 0 ? 'rgba(0,172,72,0.08)' : undefined,
              }}
            >
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm text-[var(--color-foreground)] truncate leading-snug">
                  <span className="font-medium">{r.citizenLabel}</span>
                  <span className="text-[var(--color-muted)]"> → </span>
                  <span className="text-[var(--color-primary)] font-medium">{r.department}</span>
                  <span className="text-[var(--color-muted)]"> · {r.city}</span>
                </p>
                <p className="font-sans text-xs text-[var(--color-muted)] mt-0.5">{r.partyOfOrigin} promise · {r.filedDate}</p>
              </div>
              <StatusPill status={r.status} />
            </li>
          ))}
          {recentFeed.length === 0 && (
            <li className="px-5 py-10 text-center">
              <p className="font-sans text-sm text-[var(--color-muted)]">No records match the current filters.</p>
            </li>
          )}
        </ul>
      </div>

      {/* Secondary analytics grid below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Department leaderboard — takes 2 cols on desktop */}
        <div className="lg:col-span-2 border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]">
          <div className="px-5 py-3 border-b border-[var(--color-border)]">
            <h3 className="font-serif font-semibold text-[var(--color-foreground)] text-base">Department Response Rates</h3>
            <p className="font-sans text-xs text-[var(--color-muted)]">Answered ÷ received</p>
          </div>
          <ul className="divide-y divide-[var(--color-border)]" style={{ maxHeight: 320, overflowY: 'auto' }}>
            {deptStats.map((d, i) => (
              <li key={d.dept} className="px-5 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`font-sans text-xs font-bold w-5 flex-shrink-0 ${i === 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'}`}>
                      {i + 1}
                    </span>
                    <p className="font-sans text-sm text-[var(--color-foreground)] truncate">{d.dept}</p>
                  </div>
                  <p className="font-sans text-sm font-bold ml-2 flex-shrink-0" style={{ color: d.pct >= 60 ? 'var(--color-success)' : d.pct >= 40 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                    {d.pct}%
                  </p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(201,162,39,0.1)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${d.pct}%`,
                      background: d.pct >= 60 ? 'var(--color-success)' : d.pct >= 40 ? 'var(--color-warning)' : 'var(--color-danger)',
                    }}
                  />
                </div>
                <p className="font-sans text-[10px] text-[var(--color-muted)] mt-1">{d.answered}/{d.total} answered</p>
              </li>
            ))}
            {deptStats.length === 0 && (
              <li className="px-5 py-8 text-center">
                <p className="font-sans text-sm text-[var(--color-muted)]">No data for current filters.</p>
              </li>
            )}
          </ul>
        </div>

        {/* Summary card — takes 1 col */}
        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)] p-5">
          <h3 className="font-serif font-semibold text-[var(--color-foreground)] text-base mb-4">Summary</h3>
          <div className="space-y-3">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-1">Total Filings</p>
              <p className="font-serif text-2xl font-bold text-[var(--color-primary)]">{filtered.length}</p>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-1">Success Rate</p>
              <p className="font-serif text-2xl font-bold" style={{ color: rate >= 60 ? 'var(--color-success)' : rate >= 40 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                {rate}%
              </p>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-1">Overdue Now</p>
              <p className="font-serif text-2xl font-bold text-[var(--color-danger)]">{overdue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
