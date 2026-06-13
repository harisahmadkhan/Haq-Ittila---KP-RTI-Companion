import { useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';

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
];

export default function QueryInput({ onSubmit }) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim().length >= 20) onSubmit(query.trim());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Gradient hero banner */}
      <div className="bg-gradient-to-br from-nizam_green-700 via-nizam_green-600 to-nizam_green-400 rounded-2xl px-8 py-10 text-center mb-8 shadow-xl relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <p className="font-naskh text-white/70 text-lg mb-1">حق اطلاع</p>
        <h2 className="font-sans font-bold text-2xl md:text-3xl text-white mb-3 relative">
          What do you want to know from the KP government?
        </h2>
        <p className="text-white/75 font-sans text-sm max-w-xl mx-auto relative">
          Describe your question in plain language — we'll research manifestos and news, identify the right department, and draft a legally sound RTI request in English and Urdu.
        </p>
      </div>

      {/* Input card */}
      <Card className="mb-8">
        <textarea
          className="w-full h-32 font-sans text-foreground bg-background rounded-lg border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-nizam_green-400 placeholder:text-muted"
          placeholder="e.g. Has the government built the promised schools in Swat? / کیا حکومت نے سوات میں وعدہ کیے گئے اسکول تعمیر کیے؟"
          value={query}
          onChange={e => setQuery(e.target.value)}
          maxLength={500}
        />
        <div className="flex items-center justify-between mt-2 mb-4">
          <span className="text-xs text-muted font-sans">{query.length}/500</span>
          {query.length > 0 && query.length < 20 && (
            <span className="text-xs text-warning font-sans">Please enter at least 20 characters</span>
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
        <p className="text-xs text-muted font-sans mb-4 uppercase tracking-wider font-semibold text-center">
          Or pick an example question by category
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMPLE_CATEGORIES.map(cat => (
            <div key={cat.label} className="bg-surface rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-nizam_green-700 to-nizam_green-500 px-4 py-2.5">
                <p className="text-xs font-sans font-bold text-white uppercase tracking-wider">{cat.label}</p>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {cat.queries.map(q => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="w-full text-left text-xs font-sans text-primary bg-primary_accent rounded-lg px-3 py-2 hover:bg-nizam_green-200 hover:text-nizam_green-800 transition-colors leading-snug"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
