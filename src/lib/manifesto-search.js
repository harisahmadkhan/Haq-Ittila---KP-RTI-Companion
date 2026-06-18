import { MANIFESTO_CHUNKS } from '../data/manifestos.js';
import { KP_PARTIES } from '../data/parties.js';

export { KP_PARTIES };
export const KP_GOVERNING_PARTY = 'PTI';

const STOPWORDS = new Set([
  'the', 'for', 'why', 'are', 'was', 'has', 'have', 'not', 'and', 'did',
  'how', 'what', 'who', 'when', 'been', 'being', 'that', 'this', 'with',
  'from', 'will', 'were', 'they', 'their', 'than', 'much', 'many', 'some',
  'still', 'each', 'its', 'which', 'where', 'under', 'over', 'into', 'onto',
]);

// Bidirectional prefix match: "develop" ↔ "development", "allocat" ↔ "allocated"
function tokenMatchesKeyword(token, keyword) {
  const kl = keyword.toLowerCase();
  return kl === token || kl.startsWith(token) || token.startsWith(kl);
}

export function findRelevantChunks(query, selectedParties = KP_PARTIES, maxChunks = 3) {
  const tokens = query
    .toLowerCase()
    .replace(/[–—\-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 4 && !STOPWORDS.has(t));

  return MANIFESTO_CHUNKS
    .filter(chunk => selectedParties.includes(chunk.party))
    .map(chunk => {
      // Primary: keyword match (weighted 2x)
      const keywordScore = tokens.filter(t =>
        chunk.keywords.some(k => tokenMatchesKeyword(t, k))
      ).length * 2;

      // Fallback: token appears anywhere in the chunk text body
      const textLower = chunk.text.toLowerCase();
      const textScore = tokens.filter(t => textLower.includes(t)).length * 0.5;

      return { ...chunk, score: keywordScore + textScore };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
}
