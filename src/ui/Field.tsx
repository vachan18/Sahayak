import React, { forwardRef, useId } from 'react';
import { cx } from './cx';

const control =
  'w-full bg-surface text-ink placeholder:text-ink-3 rounded-md shadow-hair px-4 min-h-[52px] text-body ' +
  'transition-shadow duration-short focus:outline-none focus:shadow-[0_0_0_2px_rgb(var(--c-neel))] ' +
  'aria-[invalid=true]:shadow-[0_0_0_2px_rgb(var(--c-sindoor))]';

interface FieldShellProps {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  children: (id: string, describedBy?: string) => React.ReactNode;
  className?: string;
}

export function FieldShell({ label, hint, error, children, className }: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  return (
    <div className={cx('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-small font-semibold text-ink">
        {label}
      </label>
      {children(id, [hintId, errId].filter(Boolean).join(' ') || undefined)}
      {hint && !error && (
        <p id={hintId} className="text-micro text-ink-3">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="text-micro font-semibold text-sindoor" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode; hint?: React.ReactNode; error?: React.ReactNode; wrapperClassName?: string };

export const TextField = forwardRef<HTMLInputElement, InputProps>(function TextField({ label, hint, error, wrapperClassName, className, ...rest }, ref) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={wrapperClassName}>
      {(id, describedBy) => <input ref={ref} id={id} aria-describedby={describedBy} aria-invalid={!!error || undefined} className={cx(control, className)} {...rest} />}
    </FieldShell>
  );
});

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: React.ReactNode; hint?: React.ReactNode; error?: React.ReactNode; wrapperClassName?: string };

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ label, hint, error, wrapperClassName, className, ...rest }, ref) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={wrapperClassName}>
      {(id, describedBy) => <textarea ref={ref} id={id} aria-describedby={describedBy} aria-invalid={!!error || undefined} className={cx(control, 'py-3 min-h-[120px] resize-y', className)} {...rest} />}
    </FieldShell>
  );
});

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { label: React.ReactNode; hint?: React.ReactNode; error?: React.ReactNode; wrapperClassName?: string };

export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(function SelectField({ label, hint, error, wrapperClassName, className, children, ...rest }, ref) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={wrapperClassName}>
      {(id, describedBy) => (
        <select ref={ref} id={id} aria-describedby={describedBy} aria-invalid={!!error || undefined} className={cx(control, 'appearance-none pe-10 bg-no-repeat', className)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23686154' viewBox='0 0 256 256'%3E%3Cpath d='M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32Z'/%3E%3C/svg%3E\")", backgroundPosition: 'right 1rem center' }} {...rest}>
          {children}
        </select>
      )}
    </FieldShell>
  );
});

export const inputClass = control;
