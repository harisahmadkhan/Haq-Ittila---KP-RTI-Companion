import { MANIFESTO_CHUNKS } from '../data/manifestos.js';
import { KP_PARTIES } from '../data/parties.js';

export { KP_PARTIES };
export const KP_GOVERNING_PARTY = 'PTI';

const STOPWORDS = new Set(['the', 'for', 'why', 'are', 'was', 'has', 'have', 'not', 'and', 'did', 'how', 'what', 'who', 'when']);

export function findRelevantChunks(query, selectedParties = KP_PARTIES, maxChunks = 3) {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter(t => t.length >= 4 && !STOPWORDS.has(t));

  return MANIFESTO_CHUNKS
    .filter(chunk => selectedParties.includes(chunk.party))
    .map(chunk => ({
      ...chunk,
      score: tokens.filter(t => chunk.keywords.some(k => k.toLowerCase() === t)).length,
    }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
}
