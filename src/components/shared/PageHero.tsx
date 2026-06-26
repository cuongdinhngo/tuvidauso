import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import Starfield from './Starfield';

interface PageHeroProps {
  icon: LucideIcon;
  title: ReactNode;
  subtitle?: ReactNode;
}

/**
 * Compact cosmic hero for shell landing pages (Calendar, Compare, ...).
 * Same atmosphere as HomePage: starfield + glow medallion + gold-sheen title.
 */
export default function PageHero({ icon: Icon, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative text-center pt-10 pb-8 md:pt-12 md:pb-10">
      <Starfield className="opacity-70" />
      <div className="relative">
        <span className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gold/10 ring-1 ring-gold/25 shadow-glow">
          <Icon className="w-6 h-6 text-gold" />
        </span>
        <h1 className="font-display text-h2 md:text-[2rem] font-bold text-gold-sheen [text-wrap:balance]">
          {title}
        </h1>
        {subtitle && <p className="text-ink-muted text-sm mt-1.5">{subtitle}</p>}
      </div>
    </section>
  );
}
