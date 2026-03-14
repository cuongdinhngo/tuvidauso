import { create } from 'zustand';

const API_KEY_STORAGE = 'tuvi_ai_apikey';
const MODEL_STORAGE = 'tuvi_ai_model';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const MAX_CACHE_SIZE = 50;

function safeGetItem(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // sessionStorage full or unavailable — silently ignore
  }
}

function safeRemoveItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // sessionStorage unavailable — silently ignore
  }
}

interface AIStore {
  apiKey: string | null;
  model: string;
  cache: Map<string, string>;
  showApiKeyModal: boolean;

  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  setModel: (model: string) => void;
  getCached: (key: string) => string | undefined;
  setCache: (key: string, value: string) => void;
  setShowApiKeyModal: (show: boolean) => void;
}

export const useAIStore = create<AIStore>((set, get) => ({
  apiKey: safeGetItem(API_KEY_STORAGE),
  model: safeGetItem(MODEL_STORAGE) || DEFAULT_MODEL,
  cache: new Map<string, string>(),
  showApiKeyModal: false,

  setApiKey: (key: string) => {
    safeSetItem(API_KEY_STORAGE, key);
    set({ apiKey: key });
  },

  clearApiKey: () => {
    safeRemoveItem(API_KEY_STORAGE);
    set({ apiKey: null, cache: new Map() });
  },

  setModel: (model: string) => {
    safeSetItem(MODEL_STORAGE, model);
    set({ model, cache: new Map() });
  },

  getCached: (key: string) => get().cache.get(key),

  setCache: (key: string, value: string) => {
    set((s) => {
      const newCache = new Map(s.cache);
      newCache.set(key, value);
      if (newCache.size > MAX_CACHE_SIZE) {
        const oldest = newCache.keys().next().value;
        if (oldest !== undefined) newCache.delete(oldest);
      }
      return { cache: newCache };
    });
  },

  setShowApiKeyModal: (show: boolean) => set({ showApiKeyModal: show }),
}));
