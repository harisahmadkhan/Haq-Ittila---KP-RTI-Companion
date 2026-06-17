const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-sonnet-4-6';

const baseHeaders = {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-calls': 'true',
};

export async function callClaude({ system, userMessage, maxTokens = 1000 }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.content[0].text;
}

// Strips markdown code fences Claude sometimes wraps JSON in
export function extractJSON(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return JSON.parse(fenced ? fenced[1].trim() : text.trim());
}

export async function callClaudeWithSearch({ system, userMessage, maxTokens = 2000 }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();

  const text = data.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');

  const sources = [];
  for (const block of data.content) {
    if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
      for (const r of block.content) {
        if (r.url) sources.push({ title: r.title || r.url, url: r.url });
      }
    }
  }

  return { text, sources };
}
