interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>;
  usage: { input_tokens: number; output_tokens: number };
}

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const STORAGE_KEY = 'tuvi_claude_api_key';

// --- API Key Management ---

export function getApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}

export function clearApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

// --- Cache ---

const cache = new Map<string, string>();

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString();
}

// --- Rate Limiting ---

let lastRequestTime = 0;
let sessionRequestCount = 0;
const COOLDOWN_MS = 15_000;
const MAX_REQUESTS_PER_SESSION = 20;

export function getRateLimitState() {
  const now = Date.now();
  const cooldownRemaining = Math.max(0, Math.ceil((COOLDOWN_MS - (now - lastRequestTime)) / 1000));
  return {
    cooldownRemaining,
    sessionRequestCount,
    maxRequests: MAX_REQUESTS_PER_SESSION,
    canRequest: cooldownRemaining === 0 && sessionRequestCount < MAX_REQUESTS_PER_SESSION,
  };
}

// --- API Service ---

export async function sendMessage(
  systemPrompt: string,
  messages: ClaudeMessage[],
  maxTokens: number = 4096
): Promise<string> {
  // Check API key
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  // Check rate limit
  const now = Date.now();
  if (now - lastRequestTime < COOLDOWN_MS) {
    const wait = Math.ceil((COOLDOWN_MS - (now - lastRequestTime)) / 1000);
    throw new Error(`RATE_LIMIT:${wait}`);
  }
  if (sessionRequestCount >= MAX_REQUESTS_PER_SESSION) {
    throw new Error('SESSION_LIMIT');
  }

  // Check cache
  const cacheKey = hashString(systemPrompt + JSON.stringify(messages));
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // Make request
  lastRequestTime = Date.now();
  sessionRequestCount++;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 401) {
        throw new Error('API key không hợp lệ. Vui lòng kiểm tra lại.');
      }
      if (response.status === 429) {
        throw new Error('Quá nhiều yêu cầu. Vui lòng đợi 30 giây rồi thử lại.');
      }
      throw new Error(errorData?.error?.message || `Lỗi API: ${response.status}`);
    }

    const data: ClaudeResponse = await response.json();
    const text = data.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    cache.set(cacheKey, text);
    return text;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Không thể kết nối tới Claude API. Kiểm tra kết nối mạng.');
    }
    throw error;
  }
}

export function clearCache(): void {
  cache.clear();
}
