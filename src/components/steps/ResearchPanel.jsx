import { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Spinner from '../ui/Spinner.jsx';
import { findRelevantChunks, KP_GOVERNING_PARTY } from '../../lib/manifesto-search.js';
import { DEMO_RESPONSES } from '../../data/demo-responses.js';

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

// ─── Manifesto reference card for a single matched chunk ────────────────────
function ManifestoCard({ chunk }) {
  const [expanded, setExpanded] = useState(false);
  const isGoverning = chunk.party === KP_GOVERNING_PARTY;
  const PREVIEW_LENGTH = 160;
  const isLong = chunk.text.length > PREVIEW_LENGTH;
  const displayText = expanded || !isLong
    ? chunk.text
    : chunk.text.slice(0, PREVIEW_LENGTH).trimEnd() + '…';

  return (
    <div className={`rounded-xl border p-4 ${isGoverning ? 'bg-nizam_green-50 border-nizam_green-200' : 'bg-surface border-gray-200'}`}>
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {isGoverning && (
          <span className="text-xs font-semibold font-sans px-2 py-0.5 rounded-full bg-primary text-white">
            Governing Party
          </span>
        )}
        <span className="text-xs font-semibold font-sans px-2 py-0.5 rounded-full bg-primary_accent text-primary">
          {chunk.party}
        </span>
        <span className="text-xs font-sans text-muted px-2 py-0.5 rounded-full bg-gray-100">
          {chunk.topic}
        </span>
        <span className="text-xs font-sans text-muted ml-auto">{chunk.source}</span>
      </div>

      {/* Manifesto text */}
      <p className="font-sans text-sm text-foreground leading-relaxed">
        "{displayText}"
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs font-sans text-primary mt-1 hover:underline focus:outline-none"
        >
          {expanded ? 'Show less' : 'Show full promise'}
        </button>
      )}
    </div>
  );
}

// ─── Manifesto references block ─────────────────────────────────────────────
function ManifestoRefs({ chunks }) {
  if (!chunks.length) return null;

  // Governing party chunks first, then others
  const sorted = [...chunks].sort((a, b) => {
    if (a.party === KP_GOVERNING_PARTY && b.party !== KP_GOVERNING_PARTY) return -1;
    if (b.party === KP_GOVERNING_PARTY && a.party !== KP_GOVERNING_PARTY) return 1;
    return 0;
  });

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="font-sans font-semibold text-foreground text-sm uppercase tracking-wide">
          Manifesto References
        </h3>
        <span className="text-xs font-sans text-muted">
          {chunks.length} promise{chunks.length > 1 ? 's' : ''} found across {[...new Set(chunks.map(c => c.party))].join(', ')}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {sorted.map(c => <ManifestoCard key={c.id} chunk={c} />)}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function ResearchPanel({ query, onProceed, onRevise, onResearchDone }) {
  const [loading, setLoading]   = useState(true);
  const [sections, setSections] = useState(null);
  const [chunks, setChunks]     = useState([]);
  const [isDemo, setIsDemo]     = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      await new Promise(r => setTimeout(r, 900));
      if (cancelled) return;

      const demo = DEMO_RESPONSES[query];
      const matched = findRelevantChunks(query);

      if (demo) {
        setIsDemo(true);
        setChunks(matched);
        setSections(parseResearchSections(demo.research));
        onResearchDone({ researchSummary: demo.research, manifestoChunks: matched });
      } else {
        setIsDemo(false);
        setChunks(matched);
        setSections(null);
        onResearchDone({ researchSummary: '', manifestoChunks: matched });
      }

      setLoading(false);
    }

    run();
    return () => { cancelled = true; };
  }, [query]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Spinner size="lg" />
        <p className="font-sans text-muted mt-4">Searching manifestos and recent news...</p>
      </div>
    );
  }

  const hasContent = sections && (sections.promises || sections.webFindings);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="font-sans font-bold text-xl text-foreground mb-1">Research Results</h2>
      <p className="text-sm text-muted font-sans mb-6">Query: <em>{query}</em></p>

      {!isDemo && (
        <Card className="mb-6 border-warning bg-warning_accent">
          <p className="font-sans text-sm text-foreground">
            <span className="font-semibold">Demo mode:</span> Live research is available for the example queries. Select one of the example questions on the previous screen to see a full research report — or continue to draft a general RTI request for this custom query.
          </p>
        </Card>
      )}

      {/* Manifesto references — always shown when chunks match */}
      <ManifestoRefs chunks={chunks} />

      {/* Research panels */}
      {hasContent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-nizam_green-50 rounded-xl border border-nizam_green-100 p-5">
            <h3 className="font-sans font-semibold text-nizam_green-800 text-sm uppercase tracking-wide mb-3">Promises Found</h3>
            <p className="font-sans text-sm text-foreground whitespace-pre-wrap">{sections.promises || 'No specific promises found.'}</p>
          </div>

          <div className="bg-surface rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-sans font-semibold text-foreground text-sm uppercase tracking-wide mb-3">Web Findings</h3>
            <p className="font-sans text-sm text-foreground whitespace-pre-wrap">{sections.webFindings || 'No relevant news found.'}</p>
          </div>

          <div className="bg-warning_accent rounded-xl border border-yellow-200 p-5">
            <h3 className="font-sans font-semibold text-warning text-sm uppercase tracking-wide mb-3">Accountability Gap</h3>
            <p className="font-sans text-sm text-foreground whitespace-pre-wrap">{sections.accountabilityGap || 'No gap information available.'}</p>
          </div>
        </div>
      )}

      {sections?.rtiRelevance && (
        <Card className="mb-6 bg-primary_accent border-nizam_green-100">
          <h3 className="font-sans font-semibold text-primary text-sm uppercase tracking-wide mb-2">RTI Relevance</h3>
          <p className="font-sans text-sm text-foreground">{sections.rtiRelevance}</p>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <Button onClick={onProceed}>Proceed to draft RTI →</Button>
        <Button variant="ghost" onClick={onRevise}>← Revise question</Button>
      </div>
    </div>
  );
}
