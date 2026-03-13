import type { PersonProfile, CompatibilityResult, RelationType } from '../types/compare';
import { analyzeNapAm } from './analyzeNapAm';
import { analyzeZodiac } from './analyzeZodiac';
import { analyzeMenhCung } from './analyzeMenhCung';
import { analyzeRelatedPalaces } from './analyzeRelatedPalaces';
import { analyzeTuHoa } from './analyzeTuHoa';
import { analyzeBatTu } from './analyzeBatTu';
import { analyzeTuanTriet } from './analyzeTuanTriet';
import { buildCompatibilityResult } from './resultBuilder';

/**
 * Calculate full compatibility between two people.
 * Pure function — no side effects.
 */
export function calculateCompatibility(
  person1: PersonProfile,
  person2: PersonProfile,
  relationType: RelationType
): CompatibilityResult {
  const categories = [
    analyzeNapAm(person1, person2),
    analyzeZodiac(person1, person2),
    analyzeMenhCung(person1, person2),
    analyzeRelatedPalaces(person1, person2, relationType),
    analyzeTuHoa(person1, person2, relationType),
    analyzeBatTu(person1, person2),
    analyzeTuanTriet(person1, person2, relationType),
  ];

  return buildCompatibilityResult(categories, relationType);
}
