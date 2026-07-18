import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'

const TABS = [
  { to: '/account', label: 'Profile', end: true },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/account/orders', label: 'Orders' },
  { to: '/account/payments', label: 'Payment History' },
]

export default function CustomerLayout() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl text-navy mb-6">My Account</h1>
      <div className="flex gap-2 border-b border-line mb-8 overflow-x-auto">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              clsx(
                'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
                isActive ? 'border-navy text-navy' : 'border-transparent text-ink-soft hover:text-ink'
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  )
}
