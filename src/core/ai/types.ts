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
