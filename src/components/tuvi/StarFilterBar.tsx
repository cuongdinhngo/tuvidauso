import { useState } from 'react';
import type { FilterMode, StarGroupName } from '../../hooks/useStarFilter';
import { STAR_GROUP_NAMES } from '../../hooks/useStarFilter';

interface StarFilterBarProps {
  mode: FilterMode;
  setMode: (mode: FilterMode) => void;
  customGroups: Set<StarGroupName>;
  toggleGroup: (group: StarGroupName) => void;
}

const MODES: { value: FilterMode; label: string }[] = [
  { value: 'chinh_cat_sat', label: 'Chính + Cát Sát' },
  { value: 'chinh', label: 'Chính tinh' },
  { value: 'all', label: 'Tất cả' },
  { value: 'custom', label: 'Tùy chọn' },
];

export default function StarFilterBar({ mode, setMode, customGroups, toggleGroup }: StarFilterBarProps) {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="mb-2">
      <div className="flex gap-1 flex-wrap">
        {MODES.map(m => (
          <button
            key={m.value}
            onClick={() => {
              setMode(m.value);
              if (m.value === 'custom') setShowCustom(true);
              else setShowCustom(false);
            }}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              mode === m.value
                ? 'bg-gold/50 text-gold border border-gold/50'
                : 'text-ink-muted border border-white/10 hover:text-ink'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'custom' && showCustom && (
        <div className="mt-2 bg-surface border border-white/10 rounded-lg p-2 grid grid-cols-2 md:grid-cols-3 gap-1">
          {STAR_GROUP_NAMES.map(group => (
            <label key={group} className="flex items-center gap-1.5 text-xs text-ink cursor-pointer hover:text-ink">
              <input
                type="checkbox"
                checked={customGroups.has(group)}
                onChange={() => toggleGroup(group)}
                className="rounded border-white/10 bg-raised text-gold focus:ring-gold w-3.5 h-3.5"
              />
              {group}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
