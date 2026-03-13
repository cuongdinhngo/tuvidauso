import { create } from 'zustand';
import type { BirthInfo } from '../core/types';
import type { PersonProfile, Relationship, RelationType } from '../core/types/compare';
import { buildPersonProfile } from '../core/compare/buildProfile';
import { calculateCompatibility } from '../core/compare/compatibility';

const MAIN_KEY = 'tuvi_compare_main';
const PROFILES_KEY = 'tuvi_compare_profiles';
const RELATIONSHIPS_KEY = 'tuvi_compare_relationships';
const MAX_PROFILES = 20;

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full — silently ignore
  }
}

interface CompareStore {
  mainProfile: PersonProfile | null;
  profiles: PersonProfile[];
  relationships: Relationship[];

  setMainProfile: (name: string, birthInfo: BirthInfo) => void;
  setMainProfileDirect: (profile: PersonProfile) => void;
  addPerson: (name: string, birthInfo: BirthInfo, relationType: RelationType) => string; // returns relationship id
  removePerson: (personId: string) => void;
  updateRelationType: (relationshipId: string, relationType: RelationType) => void;
  recalculate: (relationshipId: string) => void;
  reset: () => void;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  mainProfile: loadJSON<PersonProfile | null>(MAIN_KEY, null),
  profiles: loadJSON<PersonProfile[]>(PROFILES_KEY, []),
  relationships: loadJSON<Relationship[]>(RELATIONSHIPS_KEY, []),

  setMainProfile: (name, birthInfo) => {
    const profile = buildPersonProfile(name, birthInfo);
    set({ mainProfile: profile });
    saveJSON(MAIN_KEY, profile);
  },

  setMainProfileDirect: (profile) => {
    set({ mainProfile: profile });
    saveJSON(MAIN_KEY, profile);
  },

  addPerson: (name, birthInfo, relationType) => {
    const state = get();
    if (!state.mainProfile) throw new Error('Chưa có hồ sơ chính');
    if (state.profiles.length >= MAX_PROFILES) throw new Error('Đã đạt giới hạn 20 người');

    const profile = buildPersonProfile(name, birthInfo);
    const result = calculateCompatibility(state.mainProfile, profile, relationType);
    const relationship: Relationship = {
      id: crypto.randomUUID(),
      person1Id: state.mainProfile.id,
      person2Id: profile.id,
      relationType,
      result,
    };

    const newProfiles = [...state.profiles, profile];
    const newRelationships = [...state.relationships, relationship];

    set({ profiles: newProfiles, relationships: newRelationships });
    saveJSON(PROFILES_KEY, newProfiles);
    saveJSON(RELATIONSHIPS_KEY, newRelationships);

    return relationship.id;
  },

  removePerson: (personId) => {
    const state = get();
    const newProfiles = state.profiles.filter(p => p.id !== personId);
    const newRelationships = state.relationships.filter(
      r => r.person1Id !== personId && r.person2Id !== personId
    );

    set({ profiles: newProfiles, relationships: newRelationships });
    saveJSON(PROFILES_KEY, newProfiles);
    saveJSON(RELATIONSHIPS_KEY, newRelationships);
  },

  updateRelationType: (relationshipId, relationType) => {
    const state = get();
    const rel = state.relationships.find(r => r.id === relationshipId);
    if (!rel || !state.mainProfile) return;

    const person2 = state.profiles.find(p => p.id === rel.person2Id);
    if (!person2) return;

    const result = calculateCompatibility(state.mainProfile, person2, relationType);
    const newRelationships = state.relationships.map(r =>
      r.id === relationshipId ? { ...r, relationType, result } : r
    );

    set({ relationships: newRelationships });
    saveJSON(RELATIONSHIPS_KEY, newRelationships);
  },

  recalculate: (relationshipId) => {
    const state = get();
    const rel = state.relationships.find(r => r.id === relationshipId);
    if (!rel || !state.mainProfile) return;

    const person2 = state.profiles.find(p => p.id === rel.person2Id);
    if (!person2) return;

    const result = calculateCompatibility(state.mainProfile, person2, rel.relationType);
    const newRelationships = state.relationships.map(r =>
      r.id === relationshipId ? { ...r, result } : r
    );

    set({ relationships: newRelationships });
    saveJSON(RELATIONSHIPS_KEY, newRelationships);
  },

  reset: () => {
    set({ mainProfile: null, profiles: [], relationships: [] });
    localStorage.removeItem(MAIN_KEY);
    localStorage.removeItem(PROFILES_KEY);
    localStorage.removeItem(RELATIONSHIPS_KEY);
  },
}));
