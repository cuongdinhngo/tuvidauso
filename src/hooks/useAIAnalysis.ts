import { useState, useCallback } from 'react';
import type { AIMessage } from '../core/ai/types';
import { callProvider } from '../core/ai/callProvider';
import { useAIStore } from '../store/aiStore';

interface AIAnalysisState {
  loading: boolean;
  error: string | null;
  result: string | null;
  conversationHistory: AIMessage[];
}

const MAX_HISTORY_TURNS = 10;

function hashPrompt(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  return String(h);
}

export function useAIAnalysis() {
  const [state, setState] = useState<AIAnalysisState>({
    loading: false,
    error: null,
    result: null,
    conversationHistory: [],
  });

  const analyze = useCallback(
    async (prompt: { system: string; user: string }) => {
      const { providerConfig, getCached, setCache, setShowSettingsModal } =
        useAIStore.getState();

      if (!providerConfig) {
        setShowSettingsModal(true);
        return null;
      }

      const cacheKey = hashPrompt(providerConfig.type + providerConfig.model + prompt.system + prompt.user);
      const cached = getCached(cacheKey);
      if (cached) {
        setState((s) => ({ ...s, loading: false, result: cached, error: null, conversationHistory: [] }));
        return cached;
      }

      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const response = await callProvider(
          providerConfig,
          {
            system: prompt.system,
            messages: [{ role: 'user', content: prompt.user }],
            maxTokens: 4096,
          },
        );
        setCache(cacheKey, response.content);
        setState((s) => ({ ...s, loading: false, result: response.content, conversationHistory: [] }));
        return response.content;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
        setState((s) => ({ ...s, loading: false, error: msg }));
        return null;
      }
    },
    [],
  );

  const askQuestion = useCallback(
    async (prompt: { system: string; messages: AIMessage[] }) => {
      const { providerConfig, setShowSettingsModal } = useAIStore.getState();

      if (!providerConfig) {
        setShowSettingsModal(true);
        return null;
      }

      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const response = await callProvider(
          providerConfig,
          {
            system: prompt.system,
            messages: prompt.messages,
            maxTokens: 3000,
          },
        );
        const userMsg = prompt.messages[prompt.messages.length - 1];
        setState((s) => {
          const updated = [
            ...s.conversationHistory,
            { role: 'user' as const, content: userMsg.content },
            { role: 'assistant' as const, content: response.content },
          ];
          return {
            ...s,
            loading: false,
            result: response.content,
            conversationHistory: updated.slice(-MAX_HISTORY_TURNS * 2),
          };
        });
        return response.content;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
        setState((s) => ({ ...s, loading: false, error: msg }));
        return null;
      }
    },
    [],
  );

  const clearResult = useCallback(() => {
    setState((s) => ({ ...s, result: null, error: null }));
  }, []);

  const clearConversation = useCallback(() => {
    setState({ loading: false, error: null, result: null, conversationHistory: [] });
  }, []);

  return {
    ...state,
    analyze,
    askQuestion,
    clearResult,
    clearConversation,
  };
}
