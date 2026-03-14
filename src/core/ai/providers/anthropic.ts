import type { AIProviderConfig, AIRequest, AIResponse } from '../types';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

export async function callAnthropic(
  config: AIProviderConfig,
  request: AIRequest,
): Promise<AIResponse> {
  let res: Response;
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    };

    const directAccess = import.meta.env.VITE_DIRECT_BROWSER_ACCESS;
    if (directAccess === undefined || directAccess === 'true') {
      headers['anthropic-dangerous-direct-browser-access'] = 'true';
    }

    res = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.model,
        max_tokens: request.maxTokens || 4096,
        system: request.system,
        messages: request.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });
  } catch {
    throw new Error('Không thể kết nối đến Anthropic API. Vui lòng kiểm tra kết nối mạng.');
  }

  if (!res.ok) {
    if (res.status === 401) throw new Error('API key Anthropic không hợp lệ. Vui lòng kiểm tra lại.');
    if (res.status === 429) throw new Error('Đã vượt quá giới hạn Anthropic API. Vui lòng thử lại sau ít phút.');
    if (res.status === 529) throw new Error('Anthropic API đang quá tải. Vui lòng thử lại sau.');
    const text = await res.text().catch(() => '');
    throw new Error(`Lỗi Anthropic API (${res.status}): ${text || 'Không rõ nguyên nhân'}`);
  }

  const data = await res.json();
  const content =
    data.content
      ?.filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('') || '';

  return {
    content,
    usage: data.usage
      ? { input_tokens: data.usage.input_tokens, output_tokens: data.usage.output_tokens }
      : undefined,
  };
}
