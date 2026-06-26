import { useState, type ReactNode } from 'react';

interface TabsProps {
  tabs: { label: string; content: ReactNode }[];
  defaultIndex?: number;
}

export default function Tabs({ tabs, defaultIndex = 0 }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);

  return (
    <div>
      <div role="tablist" className="flex border-b border-white/10 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 min-h-[44px] text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              active === i
                ? 'text-gold border-gold'
                : 'text-ink-muted border-transparent hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-4">
        {tabs[active]?.content}
      </div>
    </div>
  );
}
