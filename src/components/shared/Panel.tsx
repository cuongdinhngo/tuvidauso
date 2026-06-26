import type { HTMLAttributes, ReactNode } from 'react';

interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** optional section heading rendered in the display serif */
  title?: ReactNode;
  /** optional right-aligned slot in the header (filters, counts, actions) */
  actions?: ReactNode;
  flush?: boolean;
  children: ReactNode;
}

/**
 * Data-zone container (VARIANCE 2 / MOTION 1 / DENSITY 7).
 * bg-raised + thin border, no motion. Prefer this over Card inside the
 * core (lá số, timeline, tables).
 */
export default function Panel({
  title,
  actions,
  flush = false,
  className = '',
  children,
  ...rest
}: PanelProps) {
  return (
    <section
      className={`bg-raised border border-white/[0.06] rounded-md ${className}`}
      {...rest}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
          {title && (
            <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={flush ? '' : 'p-4'}>{children}</div>
    </section>
  );
}
