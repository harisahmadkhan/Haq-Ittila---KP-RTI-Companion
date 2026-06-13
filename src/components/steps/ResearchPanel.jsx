import { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Spinner from '../ui/Spinner.jsx';
import { callClaudeWithSearch } from '../../lib/claude.js';
import { findRelevantChunks } from '../../lib/manifesto-search.js';
import { RESEARCH_PROMPT } from '../../lib/prompts.js';

function parseResearchSections(text) {
  const extract = (label) => {
    const re = new RegExp(`${label}[:\\s]*([\\s\\S]*?)(?=PROMISES FOUND:|WEB FINDINGS:|ACCOUNTABILITY GAP:|RTI RELEVANCE:|$)`, 'i');
    const m = text.match(re);
    return m ? m[1].trim() : '';
  };
  return {
    promises:      extract('PROMISES FOUND'),
    webFindings:   extract('WEB FINDINGS'),
    accountabilityGap: extract('ACCOUNTABILITY GAP'),
    rtiRelevance:  extract('RTI RELEVANCE'),
  };
}

export default function ResearchPanel({ query, onProceed, onRevise, onResearchDone }) {
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [sections, setSections] = useState(null);
  const [chunks, setChunks]     = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const matched = findRelevantChunks(query);
        setChunks(matched);

        const manifestoContext = matched.length > 0
          ? matched.map(c => `[${c.party} — ${c.topic} — ${c.source}]\n${c.text}`).join('\n\n')
          : 'No matching manifesto promises found for this query.';

        const userMessage = `Civic question: "${query}"\n\nRelevant manifesto excerpts:\n${manifestoContext}`;
        const raw = await callClaudeWithSearch({ system: RESEARCH_PROMPT, userMessage, maxTokens: 2000 });

        if (!cancelled) {
          const parsed = parseResearchSections(raw);
          setSections(parsed);
          onResearchDone({ researchSummary: raw, manifestoChunks: matched });
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
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

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-danger font-sans mb-4">Research failed: {error}</p>
        <Button variant="secondary" onClick={onRevise}>← Try again</Button>
      </div>
    );
  }

  const hasContent = sections && (sections.promises || sections.webFindings);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="font-sans font-bold text-xl text-foreground mb-1">Research Results</h2>
      <p className="text-sm text-muted font-sans mb-6">Query: <em>{query}</em></p>

      {!hasContent && (
        <Card className="mb-6 text-center">
          <p className="font-sans text-muted">No manifesto promises or recent news found for this query. You can still draft a general RTI request.</p>
        </Card>
      )}

      {chunks.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {chunks.map(c => (
            <Badge key={c.id} party={c.party}>{c.party} — {c.topic}</Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-nizam_green-50 rounded-xl border border-nizam_green-100 p-5">
          <h3 className="font-sans font-semibold text-nizam_green-800 text-sm uppercase tracking-wide mb-3">Promises Found</h3>
          <p className="font-sans text-sm text-foreground whitespace-pre-wrap">{sections?.promises || 'No specific promises found.'}</p>
        </div>

        <div className="bg-surface rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-sans font-semibold text-foreground text-sm uppercase tracking-wide mb-3">Web Findings</h3>
          <p className="font-sans text-sm text-foreground whitespace-pre-wrap">{sections?.webFindings || 'No relevant news found.'}</p>
        </div>

        <div className="bg-warning_accent rounded-xl border border-yellow-200 p-5">
          <h3 className="font-sans font-semibold text-warning text-sm uppercase tracking-wide mb-3">Accountability Gap</h3>
          <p className="font-sans text-sm text-foreground whitespace-pre-wrap">{sections?.accountabilityGap || 'No gap information available.'}</p>
        </div>
      </div>

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
