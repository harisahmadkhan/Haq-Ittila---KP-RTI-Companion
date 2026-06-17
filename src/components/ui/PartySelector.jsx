import { useState } from 'react';
import { KP_PARTIES, PARTY_INFO } from '../../data/parties.js';
import { MANIFESTO_CHUNKS } from '../../data/manifestos.js';
import { KP_GOVERNING_PARTY } from '../../lib/manifesto-search.js';
import IconBat from '../icons/IconBat.jsx';
import IconChevronDown from '../icons/IconChevronDown.jsx';

function partyStats(party) {
  const chunks = MANIFESTO_CHUNKS.filter(c => c.party === party);
  const topics = [...new Set(chunks.map(c => c.topic))];
  return { chunks: chunks.length, topics: topics.length };
}

function PartyAvatar({ party }) {
  const info = PARTY_INFO[party];
  const isBat = info?.icon === 'bat';
  const gradId = `pa-${party.replace(/[^a-z]/gi, '')}`;

  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ background: `linear-gradient(135deg, ${info?.colorFrom || '#333'}, ${info?.colorTo || '#666'})` }}>
      <div className="absolute inset-0 flex items-center justify-center">
        {isBat ? (
          <IconBat className="w-5 h-5 text-[var(--color-foreground)]" />
        ) : (
          <span className="font-serif text-xs font-bold text-[var(--color-primary)]">
            {party.replace(/[^A-Z]/g, '')}
          </span>
        )}
      </div>
    </div>
  );
}

export default function PartySelector({ selectedParties, onPartiesChange }) {
  const [open, setOpen] = useState(false);

  const toggle = (party) => {
    if (selectedParties.includes(party)) {
      if (selectedParties.length === 1) return; // must keep at least one
      onPartiesChange(selectedParties.filter(p => p !== party));
    } else {
      onPartiesChange([...selectedParties, party]);
    }
  };

  return (
    <div className="mb-6">
      {/* Collapsed pill row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-primary-accent)] hover:border-[var(--color-primary)] transition-colors text-left"
      >
        <span className="font-sans text-xs text-[var(--color-muted)] font-semibold uppercase tracking-wide flex-shrink-0">Searching:</span>
        <div className="flex items-center gap-1 flex-1 flex-wrap">
          {KP_PARTIES.map(party => {
            const info = PARTY_INFO[party];
            const active = selectedParties.includes(party);
            return (
              <span
                key={party}
                className="w-6 h-6 rounded-full flex-shrink-0 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${info.colorFrom}, ${info.colorTo})`,
                  opacity: active ? 1 : 0.3,
                }}
                title={info.fullName}
              />
            );
          })}
        </div>
        <IconChevronDown className={`w-4 h-4 text-[var(--color-primary)] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        <span className="font-sans text-xs text-[var(--color-primary)] font-semibold flex-shrink-0">Customize</span>
      </button>

      {/* Expanded cards */}
      {open && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {KP_PARTIES.map(party => {
            const info = PARTY_INFO[party];
            const checked = selectedParties.includes(party);
            const isGoverning = party === KP_GOVERNING_PARTY;
            const stats = partyStats(party);

            return (
              <button
                key={party}
                onClick={() => toggle(party)}
                className={`relative text-left border rounded-xl p-4 transition-colors
                  ${checked
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-accent)]'
                    : 'border-[var(--color-border)] bg-transparent hover:border-[var(--color-primary)]/50'
                  }`}
              >
                {/* Checkbox */}
                <div className={`absolute top-3 right-3 w-4 h-4 rounded border-2 flex items-center justify-center
                  ${checked ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-[var(--color-muted)]'}`}
                >
                  {checked && <span className="text-[var(--color-background)] text-[9px] font-bold leading-none">✓</span>}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <PartyAvatar party={party} />
                  <div className="min-w-0">
                    <p className="font-sans text-xs font-bold text-[var(--color-foreground)] truncate">{party}</p>
                    {isGoverning && (
                      <span className="text-[10px] font-semibold font-sans px-1.5 py-0.5 rounded-full bg-[var(--color-warning-accent)] text-[var(--color-warning)]">
                        Governing
                      </span>
                    )}
                  </div>
                </div>

                <p className="font-sans text-xs text-[var(--color-muted)] leading-snug mb-2 line-clamp-2">
                  {info.fullName}
                </p>

                <div className="flex items-center gap-3 text-[10px] text-[var(--color-muted)] font-sans">
                  <span>📄 {stats.chunks}</span>
                  <span>🎯 {stats.topics} topics</span>
                  <span>📅 2024</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
