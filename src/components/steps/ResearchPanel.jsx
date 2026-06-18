import { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Spinner from '../ui/Spinner.jsx';
import ResourcesList from '../ui/ResourcesList.jsx';
import { findRelevantChunks, KP_GOVERNING_PARTY } from '../../lib/manifesto-search.js';
import { PARTY_INFO } from '../../data/parties.js';
import { DEMO_RESPONSES } from '../../data/demo-responses.js';
import IconMagnifyingGlass from '../icons/IconMagnifyingGlass.jsx';
import IconCheckShield from '../icons/IconCheckShield.jsx';
import IconClock from '../icons/IconClock.jsx';
import MonogramBadge from '../icons/MonogramBadge.jsx';
import IconBat from '../icons/IconBat.jsx';

function parseResearchSections(text) {
  const extract = (label) => {
    const re = new RegExp(`${label}[:\\s]*([\\s\\S]*?)(?=PROMISES FOUND:|WEB FINDINGS:|ACCOUNTABILITY GAP:|RTI RELEVANCE:|$)`, 'i');
    const m = text.match(re);
    return m ? m[1].trim() : '';
  };
  return {
    promises:          extract('PROMISES FOUND'),
    webFindings:       extract('WEB FINDINGS'),
    accountabilityGap: extract('ACCOUNTABILITY GAP'),
    rtiRelevance:      extract('RTI RELEVANCE'),
  };
}

// Derives the Promise stage text from live-filtered manifesto chunks.
// Never falls back to pre-baked demo text — always reflects selected parties.
function chunksToPromiseText(chunks, selectedParties) {
  if (chunks.length === 0) {
    const partyList = selectedParties && selectedParties.length > 0
      ? selectedParties.join(', ')
      : 'the selected parties';
    return `No manifesto promises found for ${partyList} on this topic. The RTI request can still be filed — it does not require a prior promise to be valid.`;
  }
  return chunks
    .map(c => `• ${c.party} (${c.topic}): "${c.text.slice(0, 200).trimEnd()}${c.text.length > 200 ? '…' : ''}"`)
    .join('\n\n');
}

function countIssues(text) {
  if (!text) return 0;
  const bullets = (text.match(/[•\-\*]\s/g) || []).length;
  if (bullets > 0) return bullets;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20).length;
  return Math.min(sentences, 5);
}

function PartyChip({ chunk }) {
  const info = PARTY_INFO[chunk.party];
  const isGoverning = chunk.party === KP_GOVERNING_PARTY;
  const isBat = info?.icon === 'bat';

  return (
    <div
      className="rounded-xl border border-[var(--color-border)] p-4"
      style={isGoverning ? { borderColor: 'var(--color-primary)', background: 'var(--color-primary-accent)' } : {}}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {isGoverning && (
          <span className="text-xs font-semibold font-sans px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-[var(--color-background)]">
            Governing Party
          </span>
        )}
        {/* Party badge with gradient */}
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold font-sans px-2 py-0.5 rounded-full text-[var(--color-foreground)]"
          style={{ background: info ? `linear-gradient(135deg, ${info.colorFrom}, ${info.colorTo})` : 'var(--color-unknown-accent)' }}
        >
          {isBat ? <IconBat className="w-3 h-3" /> : (
            <MonogramBadge party={chunk.party} colorFrom={info?.colorFrom || '#333'} colorTo={info?.colorTo || '#666'} size={14} />
          )}
          {chunk.party}
        </span>
        <span className="text-xs font-sans text-[var(--color-muted)] px-2 py-0.5 rounded-full bg-[var(--color-unknown-accent)]">
          {chunk.topic}
        </span>
        <span className="text-xs font-sans text-[var(--color-muted)] ml-auto">{chunk.source}</span>
      </div>
      <p className="font-sans text-sm text-[var(--color-foreground)] leading-relaxed">
        "{chunk.text.slice(0, 160).trimEnd()}{chunk.text.length > 160 ? '…' : ''}"
      </p>
    </div>
  );
}

function ManifestoRefs({ chunks }) {
  if (!chunks.length) return null;
  const sorted = [...chunks].sort((a, b) => {
    if (a.party === KP_GOVERNING_PARTY && b.party !== KP_GOVERNING_PARTY) return -1;
    if (b.party === KP_GOVERNING_PARTY && a.party !== KP_GOVERNING_PARTY) return 1;
    return 0;
  });

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="font-serif font-semibold text-[var(--color-foreground)] text-sm uppercase tracking-wide">
          Manifesto References
        </h3>
        <span className="text-xs font-sans text-[var(--color-muted)]">
          {chunks.length} promise{chunks.length !== 1 ? 's' : ''} across {[...new Set(chunks.map(c => c.party))].join(', ')}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {sorted.map(c => <PartyChip key={c.id} chunk={c} />)}
      </div>
    </div>
  );
}

function StatSummary({ chunks, sections }) {
  const manifestoMatch = chunks.length;
  const gapCount = countIssues(sections?.accountabilityGap);
  const actionCount = Math.max(1, Math.ceil(manifestoMatch * 0.6));

  const stats = [
    { icon: <IconMagnifyingGlass className="w-5 h-5" />, value: manifestoMatch, label: 'Manifesto Match', sub: 'promises found' },
    { icon: <IconCheckShield className="w-5 h-5" />,    value: gapCount,        label: 'Gap Analysis',   sub: 'issues identified' },
    { icon: <IconClock className="w-5 h-5" />,          value: actionCount,     label: 'Accountability', sub: 'actionable for RTI' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map(s => (
        <div key={s.label} className="border border-[var(--color-border)] rounded-xl p-4 text-center">
          <div className="flex justify-center mb-1 text-[var(--color-primary)]">{s.icon}</div>
          <p className="font-serif text-2xl font-bold text-[var(--color-primary)]">{s.value}</p>
          <p className="font-sans text-xs font-semibold text-[var(--color-foreground)] mb-0.5">{s.label}</p>
          <p className="font-sans text-xs text-[var(--color-muted)]">{s.sub}</p>
          <div className="mt-2 h-1 rounded-full bg-[var(--color-primary-accent)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-primary)]"
              style={{ width: `${Math.min(100, s.value * 20)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResearchPanel({ query, selectedParties, onProceed, onRevise, onResearchDone }) {
  const [loading, setLoading]   = useState(true);
  const [sections, setSections] = useState(null);
  const [chunks, setChunks]     = useState([]);
  const [sources, setSources]   = useState([]);
  const [isDemo, setIsDemo]     = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      await new Promise(r => setTimeout(r, 900));
      if (cancelled) return;

      const demo    = DEMO_RESPONSES[query];
      const matched = findRelevantChunks(query, selectedParties);

      if (demo) {
        setIsDemo(true);
        setChunks(matched);
        setSources(demo.sources || []);
        setSections(parseResearchSections(demo.research));
        onResearchDone({ researchSummary: demo.research, manifestoChunks: matched, sources: demo.sources || [], isDemo: true });
      } else {
        setIsDemo(false);
        setChunks(matched);
        setSources([]);
        setSections(null);
        onResearchDone({ researchSummary: '', manifestoChunks: matched, sources: [], isDemo: false });
      }

      setLoading(false);
    }
    run();
    return () => { cancelled = true; };
  }, [query, selectedParties?.join(',')]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <Spinner size="lg" />
        <p className="font-sans text-[var(--color-muted)] mt-4">Searching manifestos and recent news...</p>
      </div>
    );
  }

  const hasContent = sections && (sections.promises || sections.webFindings);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="font-serif font-bold text-xl text-[var(--color-foreground)] mb-1">Research Results</h2>
      <p className="text-sm text-[var(--color-muted)] font-sans mb-6">Query: <em>{query}</em></p>

      {!isDemo && (
        <Card className="mb-6" style={{ borderColor: 'var(--color-warning)', background: 'var(--color-warning-accent)' }}>
          <p className="font-sans text-sm text-[var(--color-foreground)]">
            <span className="font-semibold">Demo note:</span> Live research is available for the example queries. Select one from the previous screen to see a full report — or continue to draft a general RTI request for this custom query.
          </p>
        </Card>
      )}

      {/* Manifesto references */}
      <ManifestoRefs chunks={chunks} />

      {/* Stat summary row */}
      {hasContent && <StatSummary chunks={chunks} sections={sections} />}

      {/* Research panels — connected vertical investigation narrative.
          Show if demo has web/gap content OR if we need to show a no-match message */}
      {(hasContent || isDemo) && (
        <div className="mb-6 relative">
          {/* Connector line running through the left icon column */}
          <div className="absolute left-[1.9rem] top-14 bottom-14 w-0.5 bg-[var(--color-primary)] opacity-30 pointer-events-none" />

          <div className="flex flex-col gap-0">
            {/* Stage 1: Promises Found */}
            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center z-10" style={{ background: 'var(--color-success-accent)' }}>
                  <svg viewBox="0 0 20 20" className="w-4 h-4 text-[var(--color-success)]" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 border border-[var(--color-border)] rounded-xl p-5 mb-4" style={{ background: 'var(--color-success-accent)' }}>
                <h3 className="font-serif font-semibold text-[var(--color-success)] text-sm uppercase tracking-wide mb-3">Promise</h3>
                <p className="font-sans text-sm text-[var(--color-foreground)] whitespace-pre-wrap">{chunksToPromiseText(chunks, selectedParties)}</p>
              </div>
            </div>

            {/* Stage 2: Web Findings */}
            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center z-10 bg-[var(--color-surface)]">
                  <svg viewBox="0 0 20 20" className="w-4 h-4 text-[var(--color-primary)]" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 border border-[var(--color-border)] rounded-xl p-5 mb-4 bg-[var(--color-surface)]">
                <h3 className="font-serif font-semibold text-[var(--color-foreground)] text-sm uppercase tracking-wide mb-3">What We Found</h3>
                <p className="font-sans text-sm text-[var(--color-foreground)] whitespace-pre-wrap">{sections.webFindings || 'No relevant news found.'}</p>
              </div>
            </div>

            {/* Stage 3: Accountability Gap */}
            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full border-2 border-[var(--color-warning)] flex items-center justify-center z-10" style={{ background: 'var(--color-warning-accent)' }}>
                  <svg viewBox="0 0 20 20" className="w-4 h-4 text-[var(--color-warning)]" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 border border-[var(--color-border)] rounded-xl p-5" style={{ background: 'var(--color-warning-accent)' }}>
                <h3 className="font-serif font-semibold text-[var(--color-warning)] text-sm uppercase tracking-wide mb-3">The Gap</h3>
                <p className="font-sans text-sm text-[var(--color-foreground)] whitespace-pre-wrap">{sections.accountabilityGap || 'No gap information available.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resources list */}
      <ResourcesList sources={sources} isDemo={isDemo} />

      {sections?.rtiRelevance && (
        <Card className="mb-6" accent>
          <h3 className="font-serif font-semibold text-[var(--color-primary)] text-sm uppercase tracking-wide mb-2">RTI Relevance</h3>
          <p className="font-sans text-sm text-[var(--color-foreground)]">{sections.rtiRelevance}</p>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <Button onClick={onProceed}>Proceed to draft RTI →</Button>
        <Button variant="ghost" onClick={onRevise}>← Revise question</Button>
      </div>
    </div>
  );
}
