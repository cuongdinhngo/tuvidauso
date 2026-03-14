import { create } from 'zustand';

const API_KEY_STORAGE = 'tuvi_ai_apikey';
const MODEL_STORAGE = 'tuvi_ai_model';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

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
  cache: Record<string, string>;
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
  cache: {},
  showApiKeyModal: false,

  setApiKey: (key: string) => {
    safeSetItem(API_KEY_STORAGE, key);
    set({ apiKey: key });
  },

  clearApiKey: () => {
    safeRemoveItem(API_KEY_STORAGE);
    set({ apiKey: null });
  },

  setModel: (model: string) => {
    safeSetItem(MODEL_STORAGE, model);
    set({ model });
  },

  getCached: (key: string) => get().cache[key],

  setCache: (key: string, value: string) => {
    set((s) => ({ cache: { ...s.cache, [key]: value } }));
  },

  setShowApiKeyModal: (show: boolean) => set({ showApiKeyModal: show }),
}));
