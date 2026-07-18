import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-navy text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight shrink-0">
          ShopSphere
        </Link>

        <Link
          to="/products"
          className="hidden sm:block text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          Browse Products
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          {user?.role === 'CUSTOMER' && (
            <Link to="/cart" className="relative text-white/90 hover:text-white">
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-marigold text-navy text-[10px] font-bold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <span className="h-8 w-8 rounded-full bg-marigold text-navy flex items-center justify-center font-semibold text-xs">
                  {user.email?.[0]?.toUpperCase()}
                </span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-paper-raised text-ink rounded-lg border border-line shadow-lg py-1"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <p className="px-4 py-2 text-xs text-ink-soft truncate border-b border-line">{user.email}</p>
                  <DashboardLink role={user.role} onNavigate={() => setMenuOpen(false)} />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-clay hover:bg-paper"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-white/90 hover:text-white">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-marigold text-navy text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-95"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function DashboardLink({ role, onNavigate }) {
  const map = {
    ADMIN: { to: '/admin', label: 'Admin Dashboard' },
    MERCHANT: { to: '/merchant', label: 'Merchant Dashboard' },
    CUSTOMER: { to: '/account', label: 'My Account' },
  }
  const item = map[role]
  if (!item) return null
  return (
    <Link to={item.to} onClick={onNavigate} className="block px-4 py-2 text-sm text-ink hover:bg-paper">
      {item.label}
    </Link>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}
