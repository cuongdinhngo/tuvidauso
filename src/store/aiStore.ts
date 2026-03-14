import { create } from 'zustand';
import type { AIProviderConfig, AIProviderType, AIMessage } from '../core/ai/types';
import { VALID_PROVIDER_TYPES } from '../core/ai/types';
import { PROVIDER_MODELS } from '../core/ai/providerData';

const STORAGE_PREFIX = 'tuvi_ai_';
const STORAGE_KEYS = {
  providerType: `${STORAGE_PREFIX}provider_type`,
  providerModel: `${STORAGE_PREFIX}provider_model`,
  providerKey: `${STORAGE_PREFIX}provider_key`,
} as const;

// Legacy keys from the old Anthropic-only implementation
const LEGACY_KEYS = {
  apiKey: 'tuvi_ai_apikey',
  model: 'tuvi_ai_model',
} as const;

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

function isValidProviderType(value: string): value is AIProviderType {
  return (VALID_PROVIDER_TYPES as readonly string[]).includes(value);
}

function loadProviderConfig(): AIProviderConfig | null {
  // Try new storage keys first
  const type = safeGetItem(STORAGE_KEYS.providerType);
  const model = safeGetItem(STORAGE_KEYS.providerModel);
  const apiKey = safeGetItem(STORAGE_KEYS.providerKey);

  if (type && model && apiKey) {
    if (isValidProviderType(type)) {
      return { type, model, apiKey };
    }
    // Invalid provider type — cleanup stale keys
    safeRemoveItem(STORAGE_KEYS.providerType);
    safeRemoveItem(STORAGE_KEYS.providerModel);
    safeRemoveItem(STORAGE_KEYS.providerKey);
    return null;
  }

  // Fallback: migrate from legacy Anthropic-only keys
  const legacyKey = safeGetItem(LEGACY_KEYS.apiKey);
  if (legacyKey) {
    const legacyModel = safeGetItem(LEGACY_KEYS.model) || PROVIDER_MODELS.anthropic[0].id;
    const config: AIProviderConfig = { type: 'anthropic', apiKey: legacyKey, model: legacyModel };

    // Persist under new keys
    safeSetItem(STORAGE_KEYS.providerType, config.type);
    safeSetItem(STORAGE_KEYS.providerModel, config.model);
    safeSetItem(STORAGE_KEYS.providerKey, config.apiKey);

    // Clean up legacy keys
    safeRemoveItem(LEGACY_KEYS.apiKey);
    safeRemoveItem(LEGACY_KEYS.model);

    return config;
  }

  return null;
}

interface TabAIState {
  result: string | null;
  initialResult?: string | null;
  initialSuggestions?: string[];
  conversationHistory: AIMessage[];
}

interface AIStore {
  providerConfig: AIProviderConfig | null;
  cache: Map<string, string>;
  showSettingsModal: boolean;
  tabResults: Map<string, TabAIState>;

  setProviderConfig: (config: AIProviderConfig) => void;
  clearProviderConfig: () => void;
  getCached: (key: string) => string | undefined;
  setCache: (key: string, value: string) => void;
  setShowSettingsModal: (show: boolean) => void;
  getTabResult: (tabId: string) => TabAIState | undefined;
  setTabResult: (tabId: string, state: TabAIState) => void;
  clearAllTabResults: () => void;
}

export const useAIStore = create<AIStore>((set, get) => ({
  providerConfig: loadProviderConfig(),
  cache: new Map<string, string>(),
  showSettingsModal: false,
  tabResults: new Map<string, TabAIState>(),

  setProviderConfig: (config: AIProviderConfig) => {
    safeSetItem(STORAGE_KEYS.providerType, config.type);
    safeSetItem(STORAGE_KEYS.providerModel, config.model);
    safeSetItem(STORAGE_KEYS.providerKey, config.apiKey);

    const prev = get().providerConfig;
    const providerChanged = prev?.type !== config.type;
    set({
      providerConfig: config,
      // Clear cache when switching providers
      ...(providerChanged ? { cache: new Map() } : {}),
    });
  },

  clearProviderConfig: () => {
    safeRemoveItem(STORAGE_KEYS.providerType);
    safeRemoveItem(STORAGE_KEYS.providerModel);
    safeRemoveItem(STORAGE_KEYS.providerKey);
    safeRemoveItem(LEGACY_KEYS.apiKey);
    safeRemoveItem(LEGACY_KEYS.model);
    set({ providerConfig: null, cache: new Map() });
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

  setShowSettingsModal: (show: boolean) => set({ showSettingsModal: show }),

  getTabResult: (tabId: string) => get().tabResults.get(tabId),

  setTabResult: (tabId: string, state: TabAIState) => {
    set((s) => {
      const newMap = new Map(s.tabResults);
      newMap.set(tabId, state);
      return { tabResults: newMap };
    });
  },

  clearAllTabResults: () => set({ tabResults: new Map() }),
}));

/** Get default model for a provider type */
export function getDefaultModel(type: AIProviderType): string {
  return PROVIDER_MODELS[type][0].id;
}
