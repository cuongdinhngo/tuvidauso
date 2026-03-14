export interface ParsedAIResponse {
  content: string;
  suggestions: string[];
}

export function parseAIResponse(raw: string): ParsedAIResponse {
  // Try with closing tag first, then without (some models omit [/SUGGESTIONS])
  const withClosing = /\[SUGGESTIONS\]\s*([\s\S]*?)\s*\[\/SUGGESTIONS\]/i;
  const withoutClosing = /\[SUGGESTIONS\]\s*([\s\S]*)/i;
  const match = raw.match(withClosing) || raw.match(withoutClosing);

  if (!match) {
    return { content: raw.trim(), suggestions: [] };
  }

  const content = raw.substring(0, raw.search(/\[SUGGESTIONS\]/i)).trim();

  const suggestions = match[1]
    .replace(/\[\/SUGGESTIONS\]/i, '')
    .trim()
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(line => line.length > 0 && line.length < 100)
    .slice(0, 3);

  return { content, suggestions };
}
