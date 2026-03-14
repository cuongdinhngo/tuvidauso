import type { AIProviderType } from './types';

export const PROVIDER_MODELS: Record<AIProviderType, { id: string; name: string; tier: 'free' | 'paid' }[]> = {
  anthropic: [
    { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4 (Khuyên dùng)', tier: 'paid' },
    { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5 (Nhanh, rẻ)', tier: 'paid' },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o (Tốt nhất)', tier: 'paid' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Nhanh, rẻ)', tier: 'paid' },
  ],
  google: [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Miễn phí)', tier: 'free' },
    { id: 'gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash (Miễn phí)', tier: 'free' },
  ],
  groq: [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Miễn phí)', tier: 'free' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Siêu nhanh)', tier: 'free' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B (Miễn phí)', tier: 'free' },
  ],
};

export const PROVIDER_INFO: Record<AIProviderType, {
  name: string;
  icon: string;
  apiKeyUrl: string;
  description: string;
  hasFree: boolean;
  keyPrefix: string;
}> = {
  anthropic: {
    name: 'Anthropic (Claude)',
    icon: '🟣',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    description: 'Chất lượng tiếng Việt tốt nhất. Trả phí.',
    hasFree: false,
    keyPrefix: 'sk-ant-',
  },
  openai: {
    name: 'OpenAI (ChatGPT)',
    icon: '🟢',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    description: 'Phổ biến nhất. Trả phí.',
    hasFree: false,
    keyPrefix: 'sk-',
  },
  google: {
    name: 'Google (Gemini)',
    icon: '🔵',
    apiKeyUrl: 'https://aistudio.google.com/apikey',
    description: 'Miễn phí 15 requests/phút. Khuyên dùng cho người mới.',
    hasFree: true,
    keyPrefix: 'AIzaSy',
  },
  groq: {
    name: 'Groq (Llama)',
    icon: '🟠',
    apiKeyUrl: 'https://console.groq.com/keys',
    description: 'Miễn phí, cực nhanh. Chất lượng tiếng Việt khá.',
    hasFree: true,
    keyPrefix: 'gsk_',
  },
};

/** Provider order for UI — free providers first */
export const PROVIDER_ORDER: AIProviderType[] = ['google', 'groq', 'anthropic', 'openai'];
