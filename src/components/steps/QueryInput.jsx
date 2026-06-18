import { useState } from 'react';
import Button from '../ui/Button.jsx';
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
  Education:            IconBook,
  Health:               IconCross,
  Infrastructure:       IconBridge,
  Agriculture:          IconWheat,
  Energy:               IconBolt,
  'Water & Sanitation': IconDroplet,
  'Local Government':   IconTownHall,
  Police:               IconShield,
  Forestry:             IconTree,
  Finance:              IconCoin,
};

const EXAMPLE_CATEGORIES = [
  {
    label: 'Education',
    queries: [
      'Has the government built the promised schools in Swat district?',
      'How many ghost schools were closed or merged in KP since 2022?',
      'What percentage of KP public school buildings have basic sanitation and clean water facilities?',
      'How much has the KP government spent on textbook printing and distribution since 2021?',
    ],
  },
  {
    label: 'Health',
    queries: [
      'How many doctors were hired for rural health centres in 2024?',
      'Are Sehat Sahulat health cards active and functional in all KP districts?',
      'What is the status of hospital waste management in KP public hospitals?',
      'How many lady health workers are active and receiving salaries in each KP district?',
    ],
  },
  {
    label: 'Infrastructure',
    queries: [
      'Why is the Peshawar BRT budget unaccounted for?',
      'What is the progress and total expenditure on the DI Khan to Peshawar Motorway?',
      'What is the current state of Swat Motorway Phase 2 and where have the allocated funds gone?',
      'How many KP public buildings have been earthquake-retrofitted under the KP Earthquake Resilience Programme?',
    ],
  },
  {
    label: 'Agriculture',
    queries: [
      'How many KP farmers received the promised subsidised fertiliser in 2024?',
      'What is the status of the KP agricultural land records digitisation programme?',
      'What is the status of the KP olive cultivation programme that was promised in the manifesto?',
      'Has the KP government established agricultural advisory services in merged districts?',
    ],
  },
  {
    label: 'Energy',
    queries: [
      'Why are KP hydropower projects delayed and where has the allocated budget gone?',
      'What percentage of merged district villages have been electrified since 2021?',
      'What is the financial performance of the KP Energy Development Organisation and how much of its budget goes to administration?',
      'How much has KP received in net hydel profits from WAPDA and is the amount disputed?',
    ],
  },
  {
    label: 'Water & Sanitation',
    queries: [
      'Why is clean drinking water still not available in Kohistan villages?',
      'What is the current sewage treatment capacity in KP cities versus actual sewage volume generated?',
      'What percentage of KP public schools have functional toilets and handwashing facilities as measured by PHED?',
      'What is the progress on new water storage dams being constructed in KP?',
    ],
  },
  {
    label: 'Local Government',
    queries: [
      'What happened to the funds allocated for Charsadda flood relief?',
      'When will KP hold local body elections and what is the legal basis for the delay?',
      'What is the total budget allocated to KP Union Councils and how is it being administered without elected members?',
      'How much municipal solid waste is being collected in Peshawar and where is it disposed?',
    ],
  },
  {
    label: 'Police',
    queries: [
      'What is the status of police station upgrades under KP Police Act 2017?',
      'How many police officers were recruited on merit in KP in 2023 and 2024?',
      'What is the FIR registration rate across KP police stations and are any districts refusing to register FIRs?',
      'How many custody deaths have been reported in KP police stations since 2022?',
    ],
  },
  {
    label: 'Forestry',
    queries: [
      'What is the current status and verified area coverage of the Billion Tree Tsunami in KP?',
      'How much revenue has KP collected from timber auctions since 2021 and how was it utilised?',
      'What is the status of enforcement under the KP Wildlife Protection Act 2015?',
      'How many forest fires occurred in KP in 2023 and what area was destroyed?',
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

// Right column: flat list of categories, clicking a category expands its queries inline
function CategoryBrowser({ onSelect }) {
  const [activeCat, setActiveCat] = useState(EXAMPLE_CATEGORIES[0].label);

  const active = EXAMPLE_CATEGORIES.find(c => c.label === activeCat);
  const CatIcon = ICON_MAP[activeCat];

  return (
    <div className="flex flex-col h-full border border-[var(--color-border)] rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
      {/* Category tab strip */}
      <div className="flex flex-wrap gap-1 p-3 border-b border-[var(--color-border)]">
        {EXAMPLE_CATEGORIES.map(cat => {
          const Icon = ICON_MAP[cat.label];
          const isActive = activeCat === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setActiveCat(cat.label)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-sans font-semibold transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)] text-[var(--color-background)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-white/5'
              }`}
            >
              {Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Query list for active category */}
      <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
        {active?.queries.map(q => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="w-full text-left text-sm font-sans text-[var(--color-muted)] rounded-lg px-3 py-2.5 border border-transparent hover:border-[var(--color-primary)] hover:text-[var(--color-foreground)] hover:bg-white/5 transition-all leading-snug"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="px-3 py-2 border-t border-[var(--color-border)]">
        <p className="font-sans text-[10px] text-[var(--color-muted)] uppercase tracking-wider">
          {active?.queries.length} example questions · click to prefill
        </p>
      </div>
    </div>
  );
}

export default function QueryInput({ selectedParties, onPartiesChange, onSubmit }) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim().length >= 20) onSubmit(query.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Left column — dark input panel */}
        <div
          className="rounded-2xl shadow-xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0B2417 0%, #0f2e1e 60%, #061610 100%)' }}
        >
          {/* Gold corner brackets */}
          <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[var(--color-primary)] rounded-tl-sm opacity-60 pointer-events-none" />
          <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[var(--color-primary)] rounded-tr-sm opacity-60 pointer-events-none" />
          <span className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[var(--color-primary)] rounded-bl-sm opacity-60 pointer-events-none" />
          <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[var(--color-primary)] rounded-br-sm opacity-60 pointer-events-none" />

          <div className="px-7 pt-8 pb-4">
            <p className="font-naskh text-[var(--color-primary)]/70 text-lg mb-1">حق اطلاع</p>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-[var(--color-foreground)] mb-2">
              What do you want to know from the KP government?
            </h2>
            <p className="text-[var(--color-muted)] font-sans text-sm leading-relaxed">
              Ask in plain language — Urdu or English. We'll research party manifestos, find the right department, and draft a legally sound RTI.
            </p>
          </div>

          <div className="px-7 pb-4">
            <PartySelector selectedParties={selectedParties} onPartiesChange={onPartiesChange} />
          </div>

          <div className="px-7 pb-7">
            <textarea
              className="w-full h-36 font-sans text-[var(--color-foreground)] rounded-lg border border-[var(--color-primary)] p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]/50 leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(4px)' }}
              placeholder="e.g. Has the government built the promised schools in Swat? / کیا حکومت نے سوات میں وعدہ کیے گئے اسکول تعمیر کیے؟"
              value={query}
              onChange={e => setQuery(e.target.value)}
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-2 mb-4">
              <span className="text-xs text-[var(--color-muted)] font-sans">{query.length}/500</span>
              {query.length > 0 && query.length < 20 && (
                <span className="text-xs text-[var(--color-warning)] font-sans">At least 20 characters needed</span>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={query.trim().length < 20}
              className="w-full justify-center"
            >
              Research this →
            </Button>
          </div>
        </div>

        {/* Right column — category browser */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[var(--color-muted)] font-sans uppercase tracking-wider font-semibold px-1">
            Browse example questions by category
          </p>
          <CategoryBrowser onSelect={q => setQuery(q)} />
        </div>

      </div>
    </div>
  );
}
