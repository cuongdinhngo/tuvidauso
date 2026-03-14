import type { AIProviderConfig, AIRequest, AIResponse } from '../types';

export async function callGoogle(
  config: AIProviderConfig,
  request: AIRequest,
): Promise<AIResponse> {
  const contents = request.messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  let res: Response;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': config.apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: request.system }] },
          contents,
          generationConfig: { maxOutputTokens: request.maxTokens || 4096 },
        }),
      },
    );
  } catch {
    throw new Error('Không thể kết nối đến Google Gemini API. Vui lòng kiểm tra kết nối mạng.');
  }

  if (!res.ok) {
    if (res.status === 400) throw new Error('API key Google không hợp lệ hoặc request sai format.');
    if (res.status === 403) throw new Error('API key Google không có quyền truy cập. Vui lòng kiểm tra lại.');
    if (res.status === 429) throw new Error('Đã vượt quá giới hạn Gemini API (15 req/phút). Vui lòng thử lại sau.');
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Lỗi Gemini API (${res.status})`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join('') || '';

  return {
    content: text,
    usage: data.usageMetadata
      ? { input_tokens: data.usageMetadata.promptTokenCount || 0, output_tokens: data.usageMetadata.candidatesTokenCount || 0 }
      : undefined,
  };
}
