import type { AIProviderConfig, AIRequest, AIResponse } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function callGroq(
  config: AIProviderConfig,
  request: AIRequest,
): Promise<AIResponse> {
  const messages = [
    { role: 'system' as const, content: request.system },
    ...request.messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  let res: Response;
  try {
    res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: request.maxTokens || 4096,
        messages,
      }),
    });
  } catch {
    throw new Error('Không thể kết nối đến Groq API. Vui lòng kiểm tra kết nối mạng.');
  }

  if (!res.ok) {
    if (res.status === 401) throw new Error('API key Groq không hợp lệ. Vui lòng kiểm tra lại.');
    if (res.status === 429) throw new Error('Đã vượt quá giới hạn Groq API. Vui lòng thử lại sau ít phút.');
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Lỗi Groq API (${res.status})`);
  }

  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content || '',
    usage: data.usage
      ? { input_tokens: data.usage.prompt_tokens || 0, output_tokens: data.usage.completion_tokens || 0 }
      : undefined,
  };
}
