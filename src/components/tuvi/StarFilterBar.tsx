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
                ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50'
                : 'text-gray-400 border border-gray-700/50 hover:text-gray-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'custom' && showCustom && (
        <div className="mt-2 bg-gray-900/90 border border-gray-700/50 rounded-lg p-2 grid grid-cols-2 md:grid-cols-3 gap-1">
          {STAR_GROUP_NAMES.map(group => (
            <label key={group} className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={customGroups.has(group)}
                onChange={() => toggleGroup(group)}
                className="rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500 w-3.5 h-3.5"
              />
              {group}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
