import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../../services/productService'
import { Card, Spinner, Badge } from '../../components/ui/Primitives'
import { formatCurrency } from '../../utils/formatters'

export default function MerchantDashboard() {
  const [products, setProducts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.listMine({ page: 0, size: 5 }).then((res) => setProducts(res.data.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" />

  const content = products?.content || []
  const pendingCount = content.filter((p) => p.approvalStatus === 'PENDING').length
  const lowStock = content.filter((p) => p.stock > 0 && p.stock <= 5).length

  return (
    <div>
      <h1 className="font-display text-3xl text-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total products" value={products?.totalElements ?? 0} />
        <StatCard label="Pending approval" value={pendingCount} accent />
        <StatCard label="Low stock (≤5)" value={lowStock} danger={lowStock > 0} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-navy">Recent products</h2>
        <Link to="/merchant/products" className="text-sm font-medium text-navy hover:underline">View all →</Link>
      </div>

      <Card className="divide-y divide-line">
        {content.length === 0 ? (
          <p className="p-6 text-sm text-ink-soft">No products yet. <Link to="/merchant/products/new" className="text-navy underline">Add your first one</Link>.</p>
        ) : (
          content.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-ink">{p.name}</p>
                <p className="text-sm text-ink-soft font-mono">{formatCurrency(p.price)} · Stock: {p.stock}</p>
              </div>
              <Badge status={p.approvalStatus} />
            </div>
          ))
        )}
      </Card>
    </div>
  )
}

function StatCard({ label, value, accent, danger }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-ink-soft mb-1">{label}</p>
      <p className={`font-display text-3xl ${danger ? 'text-clay' : accent ? 'text-marigold' : 'text-navy'}`}>
        {value}
      </p>
    </Card>
  )
}
