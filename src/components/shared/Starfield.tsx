// Decorative twinkling starfield for shell hero atmosphere.
// Purely visual: aria-hidden, pointer-events-none, honors reduced-motion via .twinkle.

// Deterministic scatter (no Math.random) so layout is stable across renders.
const STARS: { top: string; left: string; size: number; dur: number; delay: number; gold?: boolean }[] = [
  { top: '12%', left: '8%', size: 2, dur: 4.5, delay: 0 },
  { top: '22%', left: '78%', size: 3, dur: 5.2, delay: 0.6, gold: true },
  { top: '8%', left: '52%', size: 2, dur: 3.8, delay: 1.1 },
  { top: '34%', left: '18%', size: 2, dur: 4.9, delay: 0.3, gold: true },
  { top: '16%', left: '90%', size: 2, dur: 4.2, delay: 1.6 },
  { top: '44%', left: '64%', size: 3, dur: 5.6, delay: 0.9 },
  { top: '58%', left: '12%', size: 2, dur: 4.0, delay: 1.3 },
  { top: '28%', left: '38%', size: 2, dur: 3.5, delay: 2.0, gold: true },
  { top: '52%', left: '86%', size: 2, dur: 5.0, delay: 0.4 },
  { top: '70%', left: '30%', size: 2, dur: 4.6, delay: 1.8 },
  { top: '64%', left: '70%', size: 3, dur: 5.4, delay: 0.2, gold: true },
  { top: '6%', left: '28%', size: 2, dur: 4.1, delay: 2.4 },
  { top: '40%', left: '4%', size: 2, dur: 3.9, delay: 1.0 },
  { top: '76%', left: '54%', size: 2, dur: 4.7, delay: 0.7 },
  { top: '18%', left: '66%', size: 2, dur: 5.1, delay: 1.5, gold: true },
];

export default function Starfield({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Faint astrolabe rings behind the hero (single simple geometric mark). */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] md:w-[520px] md:h-[520px] rounded-full border border-gold/10" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] md:w-[360px] md:h-[360px] rounded-full border border-iris/10" />

      {STARS.map((s, i) => (
        <span
          key={i}
          className={`twinkle absolute rounded-full ${s.gold ? 'bg-gold' : 'bg-ink'}`}
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            boxShadow: s.gold ? '0 0 6px 1px rgba(226,184,74,0.6)' : '0 0 5px 1px rgba(236,234,242,0.4)',
            ['--dur' as string]: `${s.dur}s`,
            ['--delay' as string]: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
