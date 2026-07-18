import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar({ title, items }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 shrink-0 bg-navy text-white min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-display text-lg font-semibold">ShopSphere</p>
        <p className="text-xs text-white/50 mt-0.5">{title}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-marigold text-navy' : 'text-white/80 hover:bg-white/10 hover:text-white'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-white/50 truncate mb-2">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-white/80 hover:text-white"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
