import type { AIProviderConfig, AIRequest, AIResponse } from './types';
import { callAnthropic } from './providers/anthropic';
import { callOpenAI } from './providers/openai';
import { callGoogle } from './providers/google';
import { callGroq } from './providers/groq';

export async function callProvider(
  config: AIProviderConfig,
  request: AIRequest,
): Promise<AIResponse> {
  switch (config.type) {
    case 'anthropic': return callAnthropic(config, request);
    case 'openai': return callOpenAI(config, request);
    case 'google': return callGoogle(config, request);
    case 'groq': return callGroq(config, request);
    default: throw new Error(`Provider không được hỗ trợ: ${config.type}`);
  }
}
