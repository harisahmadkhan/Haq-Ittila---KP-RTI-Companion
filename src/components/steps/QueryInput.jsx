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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h2 className="font-sans font-bold text-2xl text-foreground mb-2">
          What do you want to know from the KP government?
        </h2>
        <p className="text-muted font-sans text-sm">
          Type your question in English or Urdu — we'll research promises, find the right department, and draft a legal RTI request for you.
        </p>
      </div>

      <Card>
        <textarea
          className="w-full h-36 font-sans text-foreground bg-background rounded-lg border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-nizam_green-400 placeholder:text-muted"
          placeholder="e.g. Has the government built the promised schools in Swat? / کیا حکومت نے سوات میں وعدہ کیے گئے اسکول تعمیر کیے؟"
          value={query}
          onChange={e => setQuery(e.target.value)}
          maxLength={500}
        />
        <div className="flex items-center justify-between mt-2 mb-5">
          <span className="text-xs text-muted font-sans">{query.length}/500</span>
          {query.length > 0 && query.length < 20 && (
            <span className="text-xs text-warning font-sans">Please enter at least 20 characters</span>
          )}
        </div>

        <div className="mb-5">
          <p className="text-xs text-muted font-sans mb-3 uppercase tracking-wide font-semibold">Example questions by category</p>
          <div className="flex flex-col gap-3">
            {EXAMPLE_CATEGORIES.map(cat => (
              <div key={cat.label}>
                <p className="text-xs font-sans font-semibold text-muted mb-1.5">{cat.label}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.queries.map(q => (
                    <button
                      key={q}
                      onClick={() => setQuery(q)}
                      className="text-xs font-sans bg-primary_accent text-primary rounded-full px-3 py-1.5 hover:bg-nizam_green-100 transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={query.trim().length < 20}
          className="w-full justify-center"
        >
          Research this →
        </Button>
      </Card>
    </div>
  );
}
