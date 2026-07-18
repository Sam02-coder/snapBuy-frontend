import clsx from 'clsx'

const VARIANTS = {
  primary: 'bg-navy text-white hover:bg-navy-hover',
  accent: 'bg-marigold text-navy hover:brightness-95',
  danger: 'bg-clay text-white hover:brightness-90',
  ghost: 'bg-transparent text-navy border border-line hover:bg-paper-raised',
  outline: 'bg-transparent text-navy border border-navy hover:bg-navy hover:text-white',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className,
  ...props
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-sans font-semibold transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
