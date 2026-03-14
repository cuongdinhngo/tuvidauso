import { create } from 'zustand';

const API_KEY_STORAGE = 'tuvi_ai_apikey';
const MODEL_STORAGE = 'tuvi_ai_model';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

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
  apiKey: localStorage.getItem(API_KEY_STORAGE),
  model: localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL,
  cache: {},
  showApiKeyModal: false,

  setApiKey: (key: string) => {
    localStorage.setItem(API_KEY_STORAGE, key);
    set({ apiKey: key });
  },

  clearApiKey: () => {
    localStorage.removeItem(API_KEY_STORAGE);
    set({ apiKey: null });
  },

  setModel: (model: string) => {
    localStorage.setItem(MODEL_STORAGE, model);
    set({ model });
  },

  getCached: (key: string) => get().cache[key],

  setCache: (key: string, value: string) => {
    set((s) => ({ cache: { ...s.cache, [key]: value } }));
  },

  setShowApiKeyModal: (show: boolean) => set({ showApiKeyModal: show }),
}));
