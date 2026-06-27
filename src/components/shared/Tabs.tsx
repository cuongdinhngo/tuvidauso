import { useState, useRef, useEffect, type ReactNode } from 'react';

interface TabsProps {
  tabs: { label: string; content: ReactNode }[];
  defaultIndex?: number;
}

export default function Tabs({ tabs, defaultIndex = 0 }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);
  const tablistRef = useRef<HTMLDivElement>(null);

  // Scroll the active tab into view when it changes (off-screen tabs on mobile).
  useEffect(() => {
    const activeBtn = tablistRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    activeBtn?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [active]);

  return (
    <div>
      <div className="relative">
        <div ref={tablistRef} role="tablist" className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
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
        {/* Scroll affordance: edge fades (mobile only) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-base to-transparent md:hidden" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-base to-transparent md:hidden" aria-hidden="true" />
      </div>
      <div role="tabpanel" className="mt-4">
        {tabs[active]?.content}
      </div>
    </div>
  );
}
