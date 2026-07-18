import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/merchants', label: 'Merchants' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/products', label: 'Product Approval' },
  { to: '/admin/categories', label: 'Categories' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar title="Admin" items={NAV_ITEMS} />
      <main className="flex-1 p-6 sm:p-8 max-w-6xl">
        <Outlet />
      </main>
    </div>
  )
}
