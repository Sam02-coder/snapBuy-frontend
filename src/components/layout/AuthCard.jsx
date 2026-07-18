import { Link } from 'react-router-dom'

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-display text-2xl font-semibold text-navy mb-8">
          ShopSphere
        </Link>
        <div className="bg-paper-raised border border-line rounded-xl p-8">
          <h1 className="font-display text-2xl text-navy mb-1.5">{title}</h1>
          {subtitle && <p className="text-sm text-ink-soft mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}
