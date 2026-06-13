import { MANIFESTO_CHUNKS } from '../data/manifestos.js';

export function findRelevantChunks(query, maxChunks = 3) {
  const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  return MANIFESTO_CHUNKS
    .map(chunk => ({
      ...chunk,
      score: tokens.filter(t => chunk.keywords.some(k => k.includes(t))).length,
    }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
}
