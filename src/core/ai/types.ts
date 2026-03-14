export type AIProviderType = 'anthropic' | 'openai' | 'google' | 'groq';

export const VALID_PROVIDER_TYPES: readonly AIProviderType[] = ['anthropic', 'openai', 'google', 'groq'];

export interface AIProviderConfig {
  type: AIProviderType;
  apiKey: string;
  model: string;
}

export interface AIConfig {
  apiKey: string;
  model: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  system: string;
  messages: AIMessage[];
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  usage?: { input_tokens: number; output_tokens: number };
}

export type ModelTier = 'strong' | 'medium' | 'lite';

export function getModelTier(providerType: AIProviderType, model: string): ModelTier {
  if (providerType === 'anthropic') return 'strong';
  if (providerType === 'openai') return model.includes('mini') ? 'medium' : 'strong';
  if (providerType === 'google') return model.includes('2.5') ? 'medium' : 'lite';
  // groq — all lite
  return 'lite';
}

const MAX_HISTORY_BY_TIER: Record<ModelTier, number> = {
  strong: 20,  // 10 turns
  medium: 8,   // 4 turns
  lite: 2,     // 1 turn
};

export function trimConversationHistory(messages: AIMessage[], tier: ModelTier): AIMessage[] {
  const max = MAX_HISTORY_BY_TIER[tier];
  if (messages.length <= max) return messages;
  return messages.slice(-max);
}
