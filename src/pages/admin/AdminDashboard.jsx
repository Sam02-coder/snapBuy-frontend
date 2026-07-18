import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import { productService } from '../../services/productService'
import { Card, Spinner } from '../../components/ui/Primitives'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [merchants, customers, pendingProducts] = await Promise.all([
        adminService.listMerchants({ page: 0, size: 1 }),
        adminService.listCustomers({ page: 0, size: 1 }),
        productService.listForAdmin({ status: 'PENDING', page: 0, size: 1 }),
      ])
      setStats({
        merchants: merchants.data.data.totalElements,
        customers: customers.data.data.totalElements,
        pendingProducts: pendingProducts.data.data.totalElements,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Spinner size="lg" />

  return (
    <div>
      <h1 className="font-display text-3xl text-navy mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total merchants" value={stats.merchants} />
        <StatCard label="Total customers" value={stats.customers} />
        <StatCard label="Products awaiting approval" value={stats.pendingProducts} accent={stats.pendingProducts > 0} />
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <Card className="p-6">
      <p className="text-sm text-ink-soft mb-1">{label}</p>
      <p className={`font-display text-4xl ${accent ? 'text-marigold' : 'text-navy'}`}>{value}</p>
    </Card>
  )
}
