import { MANIFESTO_CHUNKS } from '../data/manifestos.js';

const STOPWORDS = new Set(['the', 'for', 'why', 'are', 'was', 'has', 'have', 'not', 'and', 'did', 'how', 'what', 'who', 'when']);

export function findRelevantChunks(query, maxChunks = 3) {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter(t => t.length >= 4 && !STOPWORDS.has(t));

  return MANIFESTO_CHUNKS
    .map(chunk => ({
      ...chunk,
      // Compare tokens against lowercased keywords for exact word match
      score: tokens.filter(t => chunk.keywords.some(k => k.toLowerCase() === t)).length,
    }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
}
