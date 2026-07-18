import clsx from 'clsx'
import { forwardRef } from 'react'

export const Input = forwardRef(function Input({ label, error, className, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg border bg-paper-raised px-3.5 py-2.5 text-sm font-sans text-ink',
          'placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy',
          error ? 'border-clay' : 'border-line',
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-clay">{error}</span>}
    </label>
  )
})

export const TextArea = forwardRef(function TextArea({ label, error, className, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <textarea
        ref={ref}
        className={clsx(
          'w-full rounded-lg border bg-paper-raised px-3.5 py-2.5 text-sm font-sans text-ink',
          'placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy',
          error ? 'border-clay' : 'border-line',
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-clay">{error}</span>}
    </label>
  )
})

export const Select = forwardRef(function Select({ label, error, children, className, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <select
        ref={ref}
        className={clsx(
          'w-full rounded-lg border bg-paper-raised px-3.5 py-2.5 text-sm font-sans text-ink',
          'focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy',
          error ? 'border-clay' : 'border-line',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-clay">{error}</span>}
    </label>
  )
})
