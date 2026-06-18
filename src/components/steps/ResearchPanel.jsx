import { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Spinner from '../ui/Spinner.jsx';
import ResourcesList from '../ui/ResourcesList.jsx';
import { findRelevantChunks, KP_GOVERNING_PARTY } from '../../lib/manifesto-search.js';
import { PARTY_INFO } from '../../data/parties.js';
import { DEMO_RESPONSES } from '../../data/demo-responses.js';
import MonogramBadge from '../icons/MonogramBadge.jsx';
import IconBat from '../icons/IconBat.jsx';

// KP governing history for contextual party labels
const PARTY_TENURE = {
  PTI:   'Governing since 2013',
  ANP:   'Governed KP 2008–2013',
  'JUI-F': 'Federal coalition partner',
  'PML-N': 'Federal government 2022–2024',
  PPP:   'Federal coalition partner',
};

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

// Derives the Promise tab content from live-filtered chunks — never from pre-baked demo text
function chunksToPromiseText(chunks, selectedParties) {
  if (chunks.length === 0) {
    const partyList = selectedParties && selectedParties.length > 0
      ? selectedParties.join(', ')
      : 'the selected parties';
    return `No manifesto promises found for ${partyList} on this topic.\n\nAn RTI can still be filed — you don't need a prior promise for the request to be valid under the KP RTI Act 2013.`;
  }
  return chunks
    .map(c => `• ${c.party} (${c.topic}): "${c.text.slice(0, 220).trimEnd()}${c.text.length > 220 ? '…' : ''}"`)
    .join('\n\n');
}

function PartyChip({ chunk }) {
  const info      = PARTY_INFO[chunk.party];
  const isGovern  = chunk.party === KP_GOVERNING_PARTY;
  const isBat     = info?.icon === 'bat';
  const tenure    = PARTY_TENURE[chunk.party] || '';

  return (
    <div
      className="rounded-xl border border-[var(--color-border)] p-4"
      style={isGovern ? { borderColor: 'var(--color-primary)', background: 'var(--color-primary_accent)' } : {}}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold font-sans px-2 py-0.5 rounded-full text-[var(--color-foreground)]"
          style={{ background: info ? `linear-gradient(135deg, ${info.colorFrom}, ${info.colorTo})` : '#333' }}
        >
          {isBat
            ? <IconBat className="w-3 h-3" />
            : <MonogramBadge party={chunk.party} colorFrom={info?.colorFrom || '#333'} colorTo={info?.colorTo || '#666'} size={14} />
          }
          {chunk.party}
        </span>
        {tenure && (
          <span className="text-[10px] font-sans text-[var(--color-muted)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
            {tenure}
          </span>
        )}
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

// Case file tab definitions
const TABS = [
  {
    id: 'evidence',
    label: 'Evidence',
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
      </svg>
    ),
  },
  {
    id: 'findings',
    label: 'Web Findings',
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'gap',
    label: 'The Gap',
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'rti',
    label: 'RTI Relevance',
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const TAB_ACCENT = {
  evidence: 'var(--color-success)',
  findings: 'var(--color-primary)',
  gap:      'var(--color-warning)',
  rti:      'var(--color-primary)',
};

const TAB_BG = {
  evidence: 'var(--color-success_accent)',
  findings: 'var(--color-surface)',
  gap:      'var(--color-warning_accent)',
  rti:      'var(--color-primary_accent)',
};

export default function ResearchPanel({ query, selectedParties, onProceed, onRevise, onResearchDone }) {
  const [loading,  setLoading]  = useState(true);
  const [sections, setSections] = useState(null);
  const [chunks,   setChunks]   = useState([]);
  const [sources,  setSources]  = useState([]);
  const [isDemo,   setIsDemo]   = useState(false);
  const [activeTab, setActiveTab] = useState('evidence');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setActiveTab('evidence');
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

  // Tab content helpers
  const promiseText = chunksToPromiseText(chunks, selectedParties);
  const noMatch     = chunks.length === 0;

  // Which tabs are available
  const availableTabs = TABS.filter(t => {
    if (t.id === 'findings') return sections?.webFindings;
    if (t.id === 'gap')      return sections?.accountabilityGap;
    if (t.id === 'rti')      return sections?.rtiRelevance;
    return true; // evidence always shown
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Case file header */}
      <div
        className="rounded-2xl px-6 py-5 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B2417 0%, #0f2e1e 60%, #061610 100%)' }}
      >
        <span className="absolute top-3 left-4 w-5 h-5 border-t border-l border-[var(--color-primary)] opacity-50 pointer-events-none" />
        <span className="absolute top-3 right-4 w-5 h-5 border-t border-r border-[var(--color-primary)] opacity-50 pointer-events-none" />
        <span className="absolute bottom-3 left-4 w-5 h-5 border-b border-l border-[var(--color-primary)] opacity-50 pointer-events-none" />
        <span className="absolute bottom-3 right-4 w-5 h-5 border-b border-r border-[var(--color-primary)] opacity-50 pointer-events-none" />

        <p className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-primary)]/60 mb-1">Case File</p>
        <h2 className="font-serif font-bold text-xl text-[var(--color-foreground)] mb-1 leading-snug">
          {query.length > 90 ? query.slice(0, 90) + '…' : query}
        </h2>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className="font-sans text-xs text-[var(--color-muted)]">
            {chunks.length} manifesto reference{chunks.length !== 1 ? 's' : ''}
            {chunks.length > 0 && ` across ${[...new Set(chunks.map(c => c.party))].join(', ')}`}
          </span>
          {!isDemo && (
            <span
              className="font-sans text-xs px-2 py-0.5 rounded-full border"
              style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)', background: 'rgba(245,158,11,0.1)' }}
            >
              Custom query — live research mode
            </span>
          )}
          {isDemo && (
            <span
              className="font-sans text-xs px-2 py-0.5 rounded-full border"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', background: 'rgba(0,172,72,0.1)' }}
            >
              Demo response
            </span>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-[var(--color-border)] mb-0">
        {availableTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-sans text-sm font-semibold border-b-2 transition-colors -mb-px ${
                isActive
                  ? 'border-[var(--color-primary)] text-[var(--color-foreground)]'
                  : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              <span style={{ color: isActive ? TAB_ACCENT[tab.id] : undefined }}>{tab.icon}</span>
              {tab.label}
              {tab.id === 'evidence' && (
                <span
                  className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: noMatch ? 'var(--color-warning_accent)' : 'var(--color-primary_accent)',
                    color: noMatch ? 'var(--color-warning)' : 'var(--color-primary)',
                  }}
                >
                  {chunks.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content panel */}
      <div
        className="rounded-b-xl rounded-tr-xl border border-t-0 border-[var(--color-border)] p-6 mb-6 min-h-[240px]"
        style={{ background: TAB_BG[activeTab] || 'var(--color-surface)' }}
      >
        {activeTab === 'evidence' && (
          <div>
            <h3
              className="font-serif font-semibold text-sm uppercase tracking-wide mb-4"
              style={{ color: TAB_ACCENT.evidence }}
            >
              Manifesto Evidence
            </h3>
            {chunks.length > 0 ? (
              <div className="flex flex-col gap-3">
                {chunks.map(c => <PartyChip key={c.id} chunk={c} />)}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="font-sans text-sm text-[var(--color-foreground)] whitespace-pre-wrap leading-relaxed">
                  {promiseText}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'findings' && (
          <div>
            <h3
              className="font-serif font-semibold text-sm uppercase tracking-wide mb-4"
              style={{ color: TAB_ACCENT.findings }}
            >
              Web Findings
            </h3>
            <p className="font-sans text-sm text-[var(--color-foreground)] whitespace-pre-wrap leading-relaxed">
              {sections?.webFindings || 'No relevant news or statements found.'}
            </p>
            {sources.length > 0 && (
              <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
                <ResourcesList sources={sources} isDemo={isDemo} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'gap' && (
          <div>
            <h3
              className="font-serif font-semibold text-sm uppercase tracking-wide mb-4"
              style={{ color: TAB_ACCENT.gap }}
            >
              Accountability Gap
            </h3>
            <p className="font-sans text-sm text-[var(--color-foreground)] whitespace-pre-wrap leading-relaxed">
              {sections?.accountabilityGap || 'No gap identified.'}
            </p>
          </div>
        )}

        {activeTab === 'rti' && (
          <div>
            <h3
              className="font-serif font-semibold text-sm uppercase tracking-wide mb-4"
              style={{ color: TAB_ACCENT.rti }}
            >
              RTI Relevance
            </h3>
            <p className="font-sans text-sm text-[var(--color-foreground)] whitespace-pre-wrap leading-relaxed">
              {sections?.rtiRelevance || 'RTI relevance not assessed.'}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={onProceed}>Proceed to draft RTI →</Button>
        <Button variant="ghost" onClick={onRevise}>← Revise question</Button>
      </div>
    </div>
  );
}
