import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AIProviderConfig, AIRequest } from '../src/core/ai/types';

// Mock all provider modules before importing callProvider
vi.mock('../src/core/ai/providers/anthropic', () => ({
  callAnthropic: vi.fn().mockResolvedValue({ content: 'anthropic-response', usage: { input_tokens: 10, output_tokens: 20 } }),
}));
vi.mock('../src/core/ai/providers/openai', () => ({
  callOpenAI: vi.fn().mockResolvedValue({ content: 'openai-response', usage: { input_tokens: 10, output_tokens: 20 } }),
}));
vi.mock('../src/core/ai/providers/google', () => ({
  callGoogle: vi.fn().mockResolvedValue({ content: 'google-response', usage: { input_tokens: 10, output_tokens: 20 } }),
}));
vi.mock('../src/core/ai/providers/groq', () => ({
  callGroq: vi.fn().mockResolvedValue({ content: 'groq-response', usage: { input_tokens: 10, output_tokens: 20 } }),
}));

import { callProvider } from '../src/core/ai/callProvider';
import { callAnthropic } from '../src/core/ai/providers/anthropic';
import { callOpenAI } from '../src/core/ai/providers/openai';
import { callGoogle } from '../src/core/ai/providers/google';
import { callGroq } from '../src/core/ai/providers/groq';

const testRequest: AIRequest = {
  system: 'Test system',
  messages: [{ role: 'user', content: 'Hello' }],
  maxTokens: 100,
};

function makeConfig(type: string): AIProviderConfig {
  return { type: type as AIProviderConfig['type'], apiKey: 'test-key', model: 'test-model' };
}

describe('callProvider — provider routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('routes to callAnthropic for type "anthropic"', async () => {
    const result = await callProvider(makeConfig('anthropic'), testRequest);
    expect(callAnthropic).toHaveBeenCalledOnce();
    expect(callAnthropic).toHaveBeenCalledWith(makeConfig('anthropic'), testRequest);
    expect(result.content).toBe('anthropic-response');
  });

  it('routes to callOpenAI for type "openai"', async () => {
    const result = await callProvider(makeConfig('openai'), testRequest);
    expect(callOpenAI).toHaveBeenCalledOnce();
    expect(result.content).toBe('openai-response');
  });

  it('routes to callGoogle for type "google"', async () => {
    const result = await callProvider(makeConfig('google'), testRequest);
    expect(callGoogle).toHaveBeenCalledOnce();
    expect(result.content).toBe('google-response');
  });

  it('routes to callGroq for type "groq"', async () => {
    const result = await callProvider(makeConfig('groq'), testRequest);
    expect(callGroq).toHaveBeenCalledOnce();
    expect(result.content).toBe('groq-response');
  });

  it('throws for unknown provider type', async () => {
    await expect(callProvider(makeConfig('unknown'), testRequest))
      .rejects.toThrow('Provider không được hỗ trợ: unknown');
  });

  it('does not call other providers when one is selected', async () => {
    await callProvider(makeConfig('anthropic'), testRequest);
    expect(callOpenAI).not.toHaveBeenCalled();
    expect(callGoogle).not.toHaveBeenCalled();
    expect(callGroq).not.toHaveBeenCalled();
  });
});

// --- Error mapping tests: mock fetch directly, test each provider ---

describe('provider error mapping', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function mockFetchStatus(status: number, body: object = {}) {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status,
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    });
  }

  function mockFetchNetworkError() {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
  }

  // We need to import the actual (non-mocked) provider functions for error tests.
  // Use dynamic import to bypass the vi.mock above.

  describe('Anthropic errors', () => {
    it('maps 401 to Vietnamese error message', async () => {
      mockFetchStatus(401);
      // Import actual implementation
      const { callAnthropic: realCall } = await vi.importActual<typeof import('../src/core/ai/providers/anthropic')>('../src/core/ai/providers/anthropic');
      await expect(realCall(makeConfig('anthropic'), testRequest))
        .rejects.toThrow('API key Anthropic không hợp lệ');
    });

    it('maps 429 to rate limit message', async () => {
      mockFetchStatus(429);
      const { callAnthropic: realCall } = await vi.importActual<typeof import('../src/core/ai/providers/anthropic')>('../src/core/ai/providers/anthropic');
      await expect(realCall(makeConfig('anthropic'), testRequest))
        .rejects.toThrow('vượt quá giới hạn Anthropic API');
    });

    it('maps network error to connection message', async () => {
      mockFetchNetworkError();
      const { callAnthropic: realCall } = await vi.importActual<typeof import('../src/core/ai/providers/anthropic')>('../src/core/ai/providers/anthropic');
      await expect(realCall(makeConfig('anthropic'), testRequest))
        .rejects.toThrow('Không thể kết nối đến Anthropic API');
    });
  });

  describe('OpenAI errors', () => {
    it('maps 401 to Vietnamese error message', async () => {
      mockFetchStatus(401);
      const { callOpenAI: realCall } = await vi.importActual<typeof import('../src/core/ai/providers/openai')>('../src/core/ai/providers/openai');
      await expect(realCall(makeConfig('openai'), testRequest))
        .rejects.toThrow('API key OpenAI không hợp lệ');
    });

    it('maps 429 to rate limit message', async () => {
      mockFetchStatus(429);
      const { callOpenAI: realCall } = await vi.importActual<typeof import('../src/core/ai/providers/openai')>('../src/core/ai/providers/openai');
      await expect(realCall(makeConfig('openai'), testRequest))
        .rejects.toThrow('vượt quá giới hạn OpenAI API');
    });
  });

  describe('Google errors', () => {
    it('maps 403 to permission error', async () => {
      mockFetchStatus(403);
      const { callGoogle: realCall } = await vi.importActual<typeof import('../src/core/ai/providers/google')>('../src/core/ai/providers/google');
      await expect(realCall(makeConfig('google'), testRequest))
        .rejects.toThrow('API key Google không có quyền truy cập');
    });

    it('maps 429 to rate limit message', async () => {
      mockFetchStatus(429);
      const { callGoogle: realCall } = await vi.importActual<typeof import('../src/core/ai/providers/google')>('../src/core/ai/providers/google');
      await expect(realCall(makeConfig('google'), testRequest))
        .rejects.toThrow('vượt quá giới hạn Gemini API');
    });
  });

  describe('Groq errors', () => {
    it('maps 401 to Vietnamese error message', async () => {
      mockFetchStatus(401);
      const { callGroq: realCall } = await vi.importActual<typeof import('../src/core/ai/providers/groq')>('../src/core/ai/providers/groq');
      await expect(realCall(makeConfig('groq'), testRequest))
        .rejects.toThrow('API key Groq không hợp lệ');
    });

    it('maps 429 to rate limit message', async () => {
      mockFetchStatus(429);
      const { callGroq: realCall } = await vi.importActual<typeof import('../src/core/ai/providers/groq')>('../src/core/ai/providers/groq');
      await expect(realCall(makeConfig('groq'), testRequest))
        .rejects.toThrow('vượt quá giới hạn Groq API');
    });
  });
});
