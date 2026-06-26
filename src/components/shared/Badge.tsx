import type { ReactNode } from 'react';

type Tone =
  | 'neutral'
  | 'gold'
  | 'jade'
  | 'good'
  | 'warn'
  | 'bad'
  | 'kim'
  | 'moc'
  | 'thuy'
  | 'hoa'
  | 'tho';

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

// soft-fill chips: low-alpha bg + element/state colored ink + matching border
const tones: Record<Tone, string> = {
  neutral: 'bg-raised text-ink-muted border-white/10',
  gold: 'bg-gold/15 text-gold border-gold/30',
  jade: 'bg-jade/15 text-jade border-jade/30',
  good: 'bg-good/15 text-good border-good/30',
  warn: 'bg-warn/15 text-warn border-warn/30',
  bad: 'bg-bad/15 text-bad border-bad/30',
  kim: 'bg-kim/15 text-kim border-kim/30',
  moc: 'bg-moc/15 text-moc border-moc/30',
  thuy: 'bg-thuy/15 text-thuy border-thuy/30',
  hoa: 'bg-hoa/15 text-hoa border-hoa/30',
  tho: 'bg-tho/15 text-tho border-tho/30',
};

export default function Badge({ tone = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-2xs font-medium leading-tight ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
