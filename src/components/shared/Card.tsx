import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** interactive cards get hover affordance + pointer cursor (shell zone only) */
  interactive?: boolean;
  /** drop the default inner padding (e.g. when the card wraps its own header/body) */
  flush?: boolean;
  children: ReactNode;
}

export default function Card({
  interactive = false,
  flush = false,
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        'bg-surface border border-gold/[0.12] rounded-md shadow-card',
        flush ? '' : 'p-4',
        interactive
          ? 'transition-colors hover:border-gold/40 hover:bg-raised cursor-pointer'
          : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
