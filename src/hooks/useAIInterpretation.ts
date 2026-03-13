import { useState, useCallback, useEffect, useRef } from 'react';
import { sendMessage, getRateLimitState, hasApiKey } from '../services/claudeAPI';
import {
  buildOverviewPrompt,
  buildYearlyPrompt,
  buildQuestionPrompt,
  buildPalacePrompt,
} from '../services/promptBuilder';
import type { TuViChart } from '../core/types';

interface AIState {
  loading: boolean;
  error: string | null;
  result: string | null;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export function useAIInterpretation() {
  const [state, setState] = useState<AIState>({
    loading: false,
    error: null,
    result: null,
    conversationHistory: [],
  });

  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
    }
  }, [cooldown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const startCooldown = useCallback(() => {
    const { cooldownRemaining } = getRateLimitState();
    if (cooldownRemaining > 0) {
      setCooldown(cooldownRemaining);
    } else {
      setCooldown(15);
    }
  }, []);

  const parseError = useCallback((error: unknown): string => {
    if (error instanceof Error) {
      const msg = error.message;
      if (msg === 'API_KEY_MISSING') return 'Cần nhập API key để sử dụng tính năng AI.';
      if (msg.startsWith('RATE_LIMIT:')) {
        const secs = msg.split(':')[1];
        return `Vui lòng đợi ${secs} giây trước khi hỏi tiếp.`;
      }
      if (msg === 'SESSION_LIMIT') return 'Đã đạt giới hạn 20 câu hỏi cho phiên này. Vui lòng tải lại trang.';
      return msg;
    }
    return 'Đã xảy ra lỗi không xác định.';
  }, []);

  // Luận giải tổng quan
  const getOverview = useCallback(async (chart: TuViChart) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { system, user } = buildOverviewPrompt(chart);
      const result = await sendMessage(system, [{ role: 'user', content: user }], 4096);
      startCooldown();
      setState(prev => ({
        ...prev,
        loading: false,
        result,
        conversationHistory: [
          { role: 'user', content: 'Phân tích tổng quan lá số' },
          { role: 'assistant', content: result },
        ],
      }));
      return result;
    } catch (error) {
      const errorMsg = parseError(error);
      setState(prev => ({ ...prev, loading: false, error: errorMsg }));
      return null;
    }
  }, [startCooldown, parseError]);

  // Dự báo năm
  const getYearlyForecast = useCallback(async (chart: TuViChart, year: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { system, user } = buildYearlyPrompt(chart, year);
      const result = await sendMessage(system, [{ role: 'user', content: user }], 4096);
      startCooldown();
      setState(prev => ({ ...prev, loading: false, result }));
      return result;
    } catch (error) {
      const errorMsg = parseError(error);
      setState(prev => ({ ...prev, loading: false, error: errorMsg }));
      return null;
    }
  }, [startCooldown, parseError]);

  // Hỏi đáp tự do
  const askQuestion = useCallback(async (chart: TuViChart, question: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { system, messages } = buildQuestionPrompt(
        chart, question, state.conversationHistory
      );
      const result = await sendMessage(system, messages, 2048);
      startCooldown();
      setState(prev => ({
        ...prev,
        loading: false,
        result,
        conversationHistory: [
          ...prev.conversationHistory,
          { role: 'user', content: question },
          { role: 'assistant', content: result },
        ],
      }));
      return result;
    } catch (error) {
      const errorMsg = parseError(error);
      setState(prev => ({ ...prev, loading: false, error: errorMsg }));
      return null;
    }
  }, [state.conversationHistory, startCooldown, parseError]);

  // Phân tích cung
  const analyzePalace = useCallback(async (chart: TuViChart, palaceName: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { system, user } = buildPalacePrompt(chart, palaceName);
      const result = await sendMessage(system, [{ role: 'user', content: user }], 3000);
      startCooldown();
      setState(prev => ({ ...prev, loading: false, result }));
      return result;
    } catch (error) {
      const errorMsg = parseError(error);
      setState(prev => ({ ...prev, loading: false, error: errorMsg }));
      return null;
    }
  }, [startCooldown, parseError]);

  const clearHistory = useCallback(() => {
    setState({ loading: false, error: null, result: null, conversationHistory: [] });
  }, []);

  const rateLimit = getRateLimitState();

  return {
    ...state,
    cooldown,
    canRequest: rateLimit.canRequest && cooldown === 0,
    sessionRequestCount: rateLimit.sessionRequestCount,
    maxRequests: rateLimit.maxRequests,
    hasKey: hasApiKey(),
    getOverview,
    getYearlyForecast,
    askQuestion,
    analyzePalace,
    clearHistory,
  };
}
