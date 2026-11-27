import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, HTMLMotionProps } from 'framer-motion';
import { CircleNotch } from '@phosphor-icons/react';
import { cx } from './cx';
import { haptic } from '../lib/haptics';
import { press } from './motion';

export type ButtonVariant = 'primary' | 'solid' | 'secondary' | 'ghost' | 'danger' | 'quiet';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'group relative inline-flex items-center justify-center gap-2 font-semibold select-none whitespace-nowrap ' +
  'transition-[background-color,box-shadow,color,border-color] duration-short ease-out ' +
  'disabled:opacity-45 disabled:pointer-events-none focus-visible:outline-offset-2';

const variants: Record<ButtonVariant, string> = {
  // Haldi — the one action we want you to take on this screen
  primary: 'bg-haldi text-[#111E33] hover:brightness-[1.04] shadow-[inset_0_-2px_0_rgb(0_0_0/0.12)] active:shadow-press',
  // Neel — confident, institutional
  solid: 'bg-neel text-on-neel hover:bg-neel-deep dark:bg-ink dark:text-paper dark:hover:bg-white',
  secondary: 'bg-surface text-ink shadow-hair hover:bg-sunken',
  ghost: 'text-ink hover:bg-sunken',
  quiet: 'text-neel-ink hover:bg-neel-tint',
  danger: 'bg-sindoor text-white hover:brightness-110',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-3.5 text-small rounded-sm',
  md: 'h-12 px-5 text-body rounded-md',
  lg: 'h-14 px-6 text-lead rounded-md',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  loading?: boolean;
  block?: boolean;
  /** Allow the label to wrap onto several lines (long translated labels) instead of truncating */
  wrap?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type ButtonProps = CommonProps & Omit<HTMLMotionProps<'button'>, 'children' | 'className'> & { to?: undefined };
type LinkButtonProps = CommonProps & { to: string; state?: unknown; replace?: boolean; onClick?: React.MouseEventHandler; 'aria-label'?: string };

const MotionLink = motion.create(Link);

function Inner({ iconStart, iconEnd, loading, children, wrap }: CommonProps) {
  return (
    <>
      {loading ? <CircleNotch className="w-5 h-5 animate-spin" aria-hidden /> : iconStart}
      {children !== undefined && <span className={wrap ? 'min-w-0 text-start leading-snug' : 'truncate'}>{children}</span>}
      {!loading && iconEnd && <span className="inline-flex transition-transform duration-short ease-out ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">{iconEnd}</span>}
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', iconStart, iconEnd, loading, block, wrap, className, children, onClick, ...rest },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={press}
      className={cx(base, variants[variant], sizes[size], block && 'w-full', wrap && '!whitespace-normal !h-auto min-h-[3rem] py-2.5', className)}
      onClick={(e) => {
        haptic(variant === 'primary' ? 'select' : 'tap');
        onClick?.(e);
      }}
      aria-busy={loading || undefined}
      {...rest}
    >
      <Inner iconStart={iconStart} iconEnd={iconEnd} loading={loading} wrap={wrap}>
        {children}
      </Inner>
    </motion.button>
  );
});

export function LinkButton({ to, state, replace, variant = 'primary', size = 'md', iconStart, iconEnd, block, wrap, className, children, onClick, ...rest }: LinkButtonProps) {
  return (
    <MotionLink
      to={to}
      state={state}
      replace={replace}
      whileTap={press}
      onClick={(e: React.MouseEvent) => {
        haptic('tap');
        onClick?.(e);
      }}
      className={cx(base, variants[variant], sizes[size], block && 'w-full', wrap && '!whitespace-normal !h-auto min-h-[3rem] py-2.5', className)}
      {...rest}
    >
      <Inner iconStart={iconStart} iconEnd={iconEnd} wrap={wrap}>
        {children}
      </Inner>
    </MotionLink>
  );
}

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  label: string;
  children: React.ReactNode;
  variant?: 'ghost' | 'secondary' | 'solid' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  badge?: number | boolean;
}

/** Square icon button with a mandatory accessible label (also used as tooltip). */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, children, variant = 'ghost', size = 'md', badge, className, onClick, ...rest },
  ref
) {
  const dims = size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-14 h-14' : 'w-12 h-12';
  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        haptic('tap');
        onClick?.(e);
      }}
      className={cx(
        'relative inline-flex items-center justify-center rounded-md transition-colors duration-short',
        dims,
        variants[variant],
        className as string
      )}
      {...rest}
    >
      {children}
      {badge ? (
        <span
          className={cx(
            'absolute top-1.5 end-1.5 rounded-full bg-sindoor text-white ring-2 ring-surface num text-[10px] font-bold leading-none grid place-items-center',
            typeof badge === 'number' ? 'min-w-[18px] h-[18px] px-1' : 'w-2.5 h-2.5'
          )}
        >
          {typeof badge === 'number' ? (badge > 9 ? '9+' : badge) : null}
        </span>
      ) : null}
    </motion.button>
  );
});
