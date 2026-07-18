import clsx from 'clsx'
import { statusBadgeClasses } from '../../utils/formatters'

export function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx('bg-paper-raised border border-line rounded-xl', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function Badge({ status, children }) {
  return (
    <span
      className={clsx(
        'inline-block px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide',
        statusBadgeClasses(status)
      )}
    >
      {children || status}
    </span>
  )
}

export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' }
  return (
    <div className="flex items-center justify-center py-8">
      <span className={clsx('border-navy/20 border-t-navy rounded-full animate-spin', sizes[size])} />
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-6">
      <p className="font-display text-xl text-navy mb-1.5">{title}</p>
      {description && <p className="text-sm text-ink-soft mb-4">{description}</p>}
      {action}
    </div>
  )
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i)

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="px-3 py-1.5 rounded-lg text-sm font-medium text-navy border border-line disabled:opacity-40 hover:bg-paper"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={clsx(
            'h-9 w-9 rounded-lg text-sm font-medium font-mono',
            p === page ? 'bg-navy text-white' : 'text-navy hover:bg-paper border border-line'
          )}
        >
          {p + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={page === totalPages - 1}
        className="px-3 py-1.5 rounded-lg text-sm font-medium text-navy border border-line disabled:opacity-40 hover:bg-paper"
      >
        Next
      </button>
    </div>
  )
}
