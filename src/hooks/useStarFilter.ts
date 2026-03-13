import { useState, useCallback } from 'react';
import type { Star } from '../core/types';

export type FilterMode = 'all' | 'chinh' | 'chinh_cat_sat' | 'custom';

const STAR_GROUPS = {
  'Chính tinh': (s: Star) => s.type === 'chinh',
  'Lục Cát': (s: Star) => s.group === 'Lục Cát',
  'Tứ Sát': (s: Star) => s.group === 'Tứ Sát',
  'Lộc Tồn': (s: Star) => s.group === 'Lộc Tồn',
  'Không Kiếp': (s: Star) => s.group === 'Sát tinh' && ['Địa Không', 'Địa Kiếp'].includes(s.name),
  'Đào Hoa hệ': (s: Star) => ['Hồng Loan', 'Đào Hoa', 'Thiên Hỉ', 'Thiên Riêu'].includes(s.name),
  'Cô quả': (s: Star) => ['Cô Thần', 'Quả Tú'].includes(s.name),
  'Hình hại': (s: Star) => ['Thiên Hình', 'Thiên La', 'Địa Võng'].includes(s.name),
  'Sao khác': (_s: Star) => true, // fallback — only matched if no other group matches
} as const;

export type StarGroupName = keyof typeof STAR_GROUPS;
export const STAR_GROUP_NAMES = Object.keys(STAR_GROUPS) as StarGroupName[];

function getStarGroup(star: Star): StarGroupName {
  for (const [name, predicate] of Object.entries(STAR_GROUPS)) {
    if (name === 'Sao khác') continue;
    if (predicate(star)) return name as StarGroupName;
  }
  return 'Sao khác';
}

export function useStarFilter() {
  const [mode, setMode] = useState<FilterMode>('chinh_cat_sat');
  const [customGroups, setCustomGroups] = useState<Set<StarGroupName>>(
    new Set(['Chính tinh', 'Lục Cát', 'Tứ Sát', 'Lộc Tồn'])
  );

  const toggleGroup = useCallback((group: StarGroupName) => {
    setCustomGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }, []);

  const filterStars = useCallback((stars: Star[]): Star[] => {
    switch (mode) {
      case 'all':
        return stars;
      case 'chinh':
        return stars.filter(s => s.type === 'chinh');
      case 'chinh_cat_sat':
        return stars.filter(s =>
          s.type === 'chinh' || s.group === 'Lục Cát' || s.group === 'Tứ Sát' || s.group === 'Lộc Tồn'
        );
      case 'custom':
        return stars.filter(s => customGroups.has(getStarGroup(s)));
    }
  }, [mode, customGroups]);

  return { mode, setMode, customGroups, toggleGroup, filterStars };
}
