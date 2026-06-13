import { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Spinner from '../ui/Spinner.jsx';
import UrduText from '../ui/UrduText.jsx';
import { callClaude, extractJSON } from '../../lib/claude.js';
import { RTI_DRAFT_PROMPT } from '../../lib/prompts.js';

export default function RTIDraft({ query, researchSummary, department, routingReason, onDraftDone, onNext, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [draft, setDraft]     = useState(null);
  const [bodyEn, setBodyEn]   = useState('');
  const [bodyUr, setBodyUr]   = useState('');
  const [copied, setCopied]   = useState('');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const userMessage = [
          `Civic question: "${query}"`,
          `Research summary:\n${researchSummary}`,
          `Identified department: ${department.name}`,
          `Routing reason: ${routingReason}`,
        ].join('\n\n');

        const raw = await callClaude({ system: RTI_DRAFT_PROMPT, userMessage, maxTokens: 2000 });
        const parsed = extractJSON(raw);
        if (!cancelled) {
          setDraft(parsed);
          setBodyEn(parsed.body_en || '');
          setBodyUr(parsed.body_ur || '');
          onDraftDone({
            draftEn: parsed.body_en,
            draftUr: parsed.body_ur,
            subjectEn: parsed.subject_en,
            subjectUr: parsed.subject_ur,
            informationRequested: parsed.information_requested,
            escalationNote: parsed.escalation_note,
          });
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [query, researchSummary, department, routingReason]);

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Spinner size="lg" />
        <p className="font-sans text-muted mt-4">Drafting your RTI request in English and Urdu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-danger font-sans mb-4">Draft generation failed: {error}</p>
        <Button variant="secondary" onClick={onBack}>← Go back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 print-area">
      <h2 className="font-sans font-bold text-xl text-foreground mb-1">Your RTI Request</h2>
      <p className="text-sm text-muted font-sans mb-6">Both drafts are editable. Review and customise before submitting.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* English */}
        <div>
          <div className="bg-nizam_green-50 border border-nizam_green-100 rounded-t-xl px-5 py-3">
            <p className="font-sans text-xs text-nizam_green-700 uppercase tracking-wide font-semibold mb-0.5">Subject</p>
            <p className="font-sans text-foreground font-medium">{draft?.subject_en}</p>
          </div>
          <textarea
            className="w-full h-72 font-sans text-sm text-foreground bg-surface border border-t-0 border-gray-200 rounded-b-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-nizam_green-400 leading-relaxed"
            value={bodyEn}
            onChange={e => setBodyEn(e.target.value)}
          />
          <Button
            variant="secondary"
            className="mt-2 text-sm"
            onClick={() => copy(bodyEn, 'en')}
          >
            {copied === 'en' ? '✓ Copied!' : 'Copy English draft'}
          </Button>
        </div>

        {/* Urdu */}
        <div dir="rtl">
          <div className="bg-primary_accent border border-nizam_green-100 rounded-t-xl px-5 py-3">
            <p className="font-naskh text-xs text-nizam_green-700 uppercase tracking-wide font-semibold mb-0.5">موضوع</p>
            <UrduText className="text-foreground font-medium block">{draft?.subject_ur}</UrduText>
          </div>
          <textarea
            dir="rtl"
            lang="ur"
            className="w-full h-72 font-naskh text-sm text-foreground bg-surface border border-t-0 border-gray-200 rounded-b-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-nizam_green-400 leading-loose text-right"
            value={bodyUr}
            onChange={e => setBodyUr(e.target.value)}
          />
          <div dir="ltr">
            <Button
              variant="secondary"
              className="mt-2 text-sm"
              onClick={() => copy(bodyUr, 'ur')}
            >
              {copied === 'ur' ? '✓ Copied!' : 'Copy Urdu draft'}
            </Button>
          </div>
        </div>
      </div>

      {/* Information requested list */}
      {draft?.information_requested?.length > 0 && (
        <Card className="mb-4">
          <h3 className="font-sans font-semibold text-foreground text-sm mb-3">Information Requested</h3>
          <ul className="list-disc list-inside space-y-1">
            {draft.information_requested.map((item, i) => (
              <li key={i} className="font-sans text-sm text-foreground">{item}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Escalation note */}
      {draft?.escalation_note && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="font-sans text-xs text-muted">{draft.escalation_note}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 no-print">
        <Button onClick={onNext}>Submit to next step →</Button>
        <Button variant="secondary" onClick={() => window.print()}>Download as PDF</Button>
      </div>
    </div>
  );
}
