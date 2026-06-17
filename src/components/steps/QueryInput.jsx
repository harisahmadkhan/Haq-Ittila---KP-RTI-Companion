import { useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import PartySelector from '../ui/PartySelector.jsx';
import IconBook from '../icons/IconBook.jsx';
import IconCross from '../icons/IconCross.jsx';
import IconBridge from '../icons/IconBridge.jsx';
import IconWheat from '../icons/IconWheat.jsx';
import IconBolt from '../icons/IconBolt.jsx';
import IconDroplet from '../icons/IconDroplet.jsx';
import IconTownHall from '../icons/IconTownHall.jsx';
import IconShield from '../icons/IconShield.jsx';
import IconTree from '../icons/IconTree.jsx';
import IconCoin from '../icons/IconCoin.jsx';

const ICON_MAP = {
  Education:        IconBook,
  Health:           IconCross,
  Infrastructure:   IconBridge,
  Agriculture:      IconWheat,
  Energy:           IconBolt,
  'Water & Sanitation': IconDroplet,
  'Local Government':   IconTownHall,
  Police:           IconShield,
  Forestry:         IconTree,
  Finance:          IconCoin,
};

const EXAMPLE_CATEGORIES = [
  {
    label: 'Education',
    queries: [
      'Has the government built the promised schools in Swat district?',
      'How many ghost schools were closed or merged in KP since 2022?',
    ],
  },
  {
    label: 'Health',
    queries: [
      'How many doctors were hired for rural health centres in 2024?',
      'Are Sehat Sahulat health cards active and functional in all KP districts?',
    ],
  },
  {
    label: 'Infrastructure',
    queries: [
      'Why is the Peshawar BRT budget unaccounted for?',
      'What is the progress and total expenditure on the DI Khan to Peshawar Motorway?',
    ],
  },
  {
    label: 'Agriculture',
    queries: [
      'How many KP farmers received the promised subsidised fertiliser in 2024?',
      'What is the status of the KP agricultural land records digitisation programme?',
    ],
  },
  {
    label: 'Energy',
    queries: [
      'Why are KP hydropower projects delayed and where has the allocated budget gone?',
      'What percentage of merged district villages have been electrified since 2021?',
    ],
  },
  {
    label: 'Water & Sanitation',
    queries: [
      'Why is clean drinking water still not available in Kohistan villages?',
    ],
  },
  {
    label: 'Local Government',
    queries: [
      'What happened to the funds allocated for Charsadda flood relief?',
      'When will KP hold local body elections and what is the legal basis for the delay?',
    ],
  },
  {
    label: 'Police',
    queries: [
      'What is the status of police station upgrades under KP Police Act 2017?',
      'How many police officers were recruited on merit in KP in 2023 and 2024?',
    ],
  },
  {
    label: 'Forestry',
    queries: [
      'What is the current status and verified area coverage of the Billion Tree Tsunami in KP?',
    ],
  },
  {
    label: 'Finance',
    queries: [
      'How much of the KP provincial development fund was actually disbursed versus allocated in 2023–24?',
      'What are the audit objections raised by the Public Accounts Committee against KP departments in 2024?',
      'What is the departmental budget utilisation rate for each KP ministry in the last fiscal year?',
      'How much of the KP Annual Development Programme budget remained unspent at the end of 2023–24?',
    ],
  },
];

export default function QueryInput({ selectedParties, onPartiesChange, onSubmit }) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim().length >= 20) onSubmit(query.trim());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero banner with gold corner brackets */}
      <div
        className="rounded-2xl px-8 py-10 text-center mb-8 shadow-xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-background) 0%, #0f2e1e 50%, #0B2417 100%)' }}
      >
        {/* Gold corner brackets */}
        <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[var(--color-primary)] rounded-tl-sm opacity-60" />
        <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[var(--color-primary)] rounded-tr-sm opacity-60" />
        <span className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[var(--color-primary)] rounded-bl-sm opacity-60" />
        <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[var(--color-primary)] rounded-br-sm opacity-60" />

        <p className="font-naskh text-[var(--color-primary)]/70 text-lg mb-1">حق اطلاع</p>
        <h2 className="font-serif font-bold text-2xl md:text-3xl text-[var(--color-foreground)] mb-3 relative">
          What do you want to know from the KP government?
        </h2>
        <p className="text-[var(--color-muted)] font-sans text-sm max-w-xl mx-auto relative">
          Describe your question in plain language — we'll research manifestos and news, identify the right department, and draft a legally sound RTI request in English and Urdu.
        </p>
      </div>

      {/* Party selector */}
      <PartySelector selectedParties={selectedParties} onPartiesChange={onPartiesChange} />

      {/* Input card */}
      <Card className="mb-8">
        <textarea
          className="w-full h-32 font-sans text-[var(--color-foreground)] bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]"
          placeholder="e.g. Has the government built the promised schools in Swat? / کیا حکومت نے سوات میں وعدہ کیے گئے اسکول تعمیر کیے؟"
          value={query}
          onChange={e => setQuery(e.target.value)}
          maxLength={500}
        />
        <div className="flex items-center justify-between mt-2 mb-4">
          <span className="text-xs text-[var(--color-muted)] font-sans">{query.length}/500</span>
          {query.length > 0 && query.length < 20 && (
            <span className="text-xs text-[var(--color-warning)] font-sans">Please enter at least 20 characters</span>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={query.trim().length < 20}
          className="w-full justify-center"
        >
          Research this →
        </Button>
      </Card>

      {/* Category grid */}
      <div className="mb-3">
        <p className="text-xs text-[var(--color-muted)] font-sans mb-4 uppercase tracking-wider font-semibold text-center">
          Or pick an example question by category
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMPLE_CATEGORIES.map(cat => {
            const CatIcon = ICON_MAP[cat.label];
            return (
              <div key={cat.label} className="bg-transparent rounded-xl border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-primary)] transition-colors">
                <div className="px-4 py-2.5 border-b border-[var(--color-border)] flex items-center gap-2">
                  {CatIcon && <CatIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />}
                  <p className="text-xs font-sans font-bold text-[var(--color-primary)] uppercase tracking-wider">{cat.label}</p>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  {cat.queries.map(q => (
                    <button
                      key={q}
                      onClick={() => setQuery(q)}
                      className="w-full text-left text-xs font-sans text-[var(--color-muted)] bg-[var(--color-primary-accent)] rounded-lg px-3 py-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition-colors leading-snug"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
