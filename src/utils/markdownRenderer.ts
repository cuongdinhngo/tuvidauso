/**
 * Simple markdown-to-HTML renderer. No external dependencies.
 * Handles: ## headings, **bold**, *italic*, - lists, ⭐ ratings, paragraphs.
 */
export function renderMarkdown(text: string): string {
  // Escape HTML entities first (prevent XSS)
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Split into lines for block-level processing
  const lines = html.split('\n');
  const output: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line — close list if open, add paragraph break
    if (!trimmed) {
      if (inList) { output.push('</ul>'); inList = false; }
      output.push('');
      continue;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      if (inList) { output.push('</ul>'); inList = false; }
      output.push(`<h4 class="text-md font-bold text-yellow-400 mt-4 mb-2">${inlineFormat(trimmed.slice(4))}</h4>`);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      if (inList) { output.push('</ul>'); inList = false; }
      output.push(`<h3 class="text-lg font-bold text-purple-400 mt-6 mb-3">${inlineFormat(trimmed.slice(3))}</h3>`);
      continue;
    }

    // List items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) { output.push('<ul class="list-disc ml-4 mb-3 space-y-1">'); inList = true; }
      output.push(`<li class="text-gray-300">${inlineFormat(trimmed.slice(2))}</li>`);
      continue;
    }

    // Regular paragraph line
    if (inList) { output.push('</ul>'); inList = false; }
    output.push(`<p class="text-gray-300 mb-2 leading-relaxed">${inlineFormat(trimmed)}</p>`);
  }

  if (inList) output.push('</ul>');

  return output.join('\n');
}

/** Format inline markdown: bold, italic, star ratings */
function inlineFormat(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Star ratings — e.g. "⭐ 4/5" or "(⭐⭐⭐⭐ 4/5)"
    .replace(/(⭐[⭐☆]*\s*\(?[\d/]+\)?)/g,
      '<span class="inline-block bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded text-sm font-bold">$1</span>');
}
