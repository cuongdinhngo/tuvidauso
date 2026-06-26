import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md ' +
  'transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none ' +
  'active:translate-y-px';

const variants: Record<Variant, string> = {
  // gold fill, dark ink keeps contrast >= 4.5:1
  primary: 'bg-gold text-base hover:bg-gold/90 font-semibold',
  secondary:
    'bg-surface text-ink border border-gold/25 hover:border-gold/50 hover:bg-raised',
  ghost: 'text-ink-muted hover:text-ink hover:bg-raised',
  danger: 'bg-bad/15 text-bad border border-bad/40 hover:bg-bad/25',
};

// min-height keeps touch targets >= 44px on md/lg
const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 min-h-[36px]',
  md: 'text-sm px-4 py-2.5 min-h-[44px]',
  lg: 'text-base px-6 py-3 min-h-[48px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
