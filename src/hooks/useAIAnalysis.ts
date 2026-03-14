import { useState, useCallback, useEffect } from 'react';
import type { AIMessage } from '../core/ai/types';
import { callProvider } from '../core/ai/callProvider';
import { useAIStore } from '../store/aiStore';

interface AIAnalysisState {
  loading: boolean;
  error: string | null;
  result: string | null;
  initialResult: string | null;
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

export function useAIAnalysis(tabId?: string) {
  const [state, setState] = useState<AIAnalysisState>(() => {
    if (tabId) {
      const saved = useAIStore.getState().getTabResult(tabId);
      if (saved) {
        return {
          loading: false,
          error: null,
          result: saved.result,
          initialResult: saved.initialResult ?? null,
          conversationHistory: saved.conversationHistory,
        };
      }
    }
    return { loading: false, error: null, result: null, initialResult: null, conversationHistory: [] };
  });

  // Persist result + conversation to store whenever they change
  useEffect(() => {
    if (tabId && (state.result !== null || state.conversationHistory.length > 0)) {
      useAIStore.getState().setTabResult(tabId, {
        result: state.result,
        initialResult: state.initialResult,
        conversationHistory: state.conversationHistory,
      });
    }
  }, [tabId, state.result, state.initialResult, state.conversationHistory]);

  const analyze = useCallback(
    async (prompt: { system: string; user: string }) => {
      const { providerConfig, getCached, setCache, setShowSettingsModal } =
        useAIStore.getState();

      if (!providerConfig) {
        setShowSettingsModal(true);
        return null;
      }

      const cacheKey = hashPrompt([providerConfig.type, providerConfig.model, prompt.system, prompt.user].join('\0'));
      const cached = getCached(cacheKey);
      if (cached) {
        setState((s) => ({ ...s, loading: false, result: cached, initialResult: cached, error: null, conversationHistory: [] }));
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
        setState((s) => ({ ...s, loading: false, result: response.content, initialResult: response.content, conversationHistory: [] }));
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
    async (prompt: { system: string; messages: AIMessage[] }, displayQuestion?: string) => {
      const { providerConfig, setShowSettingsModal } = useAIStore.getState();

      if (!providerConfig) {
        setShowSettingsModal(true);
        return null;
      }

      // Optimistic update: add user message to history immediately
      const userMsg = prompt.messages[prompt.messages.length - 1];
      setState((s) => ({
        ...s,
        loading: true,
        error: null,
        conversationHistory: [
          ...s.conversationHistory,
          { role: 'user' as const, content: userMsg.content, displayContent: displayQuestion || userMsg.content },
        ],
      }));

      try {
        const response = await callProvider(
          providerConfig,
          {
            system: prompt.system,
            messages: prompt.messages,
            maxTokens: 3000,
          },
        );
        // Append assistant response to existing history
        setState((s) => ({
          ...s,
          loading: false,
          result: response.content,
          conversationHistory: [
            ...s.conversationHistory,
            { role: 'assistant' as const, content: response.content, displayContent: response.content },
          ].slice(-MAX_HISTORY_TURNS * 2),
        }));
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
    setState((s) => ({ ...s, result: null, initialResult: null, error: null }));
    if (tabId) {
      useAIStore.getState().setTabResult(tabId, { result: null, initialResult: null, conversationHistory: [] });
    }
  }, [tabId]);

  const clearConversation = useCallback(() => {
    setState({ loading: false, error: null, result: null, initialResult: null, conversationHistory: [] });
    if (tabId) {
      useAIStore.getState().setTabResult(tabId, { result: null, initialResult: null, conversationHistory: [] });
    }
  }, [tabId]);

  return {
    ...state,
    analyze,
    askQuestion,
    clearResult,
    clearConversation,
  };
}
