import { getElement, getYinYang, type Element, GENERATION_CYCLE, OVERCOMING_CYCLE } from './fiveElements';

/**
 * Thap Than (Ten Gods) - relationship between Day Master (Nhat Chu) and other Can.
 *
 * Same element, same yin/yang → Tỷ Kiên
 * Same element, diff yin/yang → Kiếp Tài
 * Day Master generates, same yin/yang → Thực Thần
 * Day Master generates, diff yin/yang → Thương Quan
 * Day Master overcomes, same yin/yang → Thiên Tài (偏財)
 * Day Master overcomes, diff yin/yang → Chính Tài (正財)
 * Overcomes Day Master, same yin/yang → Thiên Quan (Thất Sát)
 * Overcomes Day Master, diff yin/yang → Chính Quan
 * Generates Day Master, same yin/yang → Thiên Ấn (Kiêu Ấn)
 * Generates Day Master, diff yin/yang → Chính Ấn
 */
export function getTenGod(dayCan: string, otherCan: string): string {
  const dayElement = getElement(dayCan);
  const otherElement = getElement(otherCan);
  const dayYY = getYinYang(dayCan);
  const otherYY = getYinYang(otherCan);
  const sameYY = dayYY === otherYY;

  // Same element
  if (dayElement === otherElement) {
    return sameYY ? 'Tỷ Kiên' : 'Kiếp Tài';
  }

  // Day Master generates other
  if (GENERATION_CYCLE[dayElement] === otherElement) {
    return sameYY ? 'Thực Thần' : 'Thương Quan';
  }

  // Day Master overcomes other
  if (OVERCOMING_CYCLE[dayElement] === otherElement) {
    return sameYY ? 'Thiên Tài' : 'Chính Tài';
  }

  // Other overcomes Day Master (find what overcomes dayElement)
  const whatOvercomesDay = Object.entries(OVERCOMING_CYCLE).find(([, v]) => v === dayElement)?.[0] as Element;
  if (otherElement === whatOvercomesDay) {
    return sameYY ? 'Thiên Quan' : 'Chính Quan';
  }

  // Other generates Day Master
  const whatGeneratesDay = Object.entries(GENERATION_CYCLE).find(([, v]) => v === dayElement)?.[0] as Element;
  if (otherElement === whatGeneratesDay) {
    return sameYY ? 'Thiên Ấn' : 'Chính Ấn';
  }

  return '';
}
