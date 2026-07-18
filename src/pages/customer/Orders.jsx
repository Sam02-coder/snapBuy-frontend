import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../../services/orderService'
import { Card, Spinner, EmptyState, Badge, Pagination } from '../../components/ui/Primitives'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function Orders() {
  const [result, setResult] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    orderService.history({ page, size: 10 }).then((res) => setResult(res.data.data)).finally(() => setLoading(false))
  }, [page])

  if (loading) return <Spinner />

  if (!result?.content?.length) {
    return <EmptyState title="No orders yet" description="Your order history will show up here." />
  }

  return (
    <div>
      <div className="space-y-4">
        {result.content.map((order) => (
          <Link key={order.id} to={`/account/orders/${order.id}`}>
            <Card className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono font-semibold text-navy">Order #{order.id}</p>
                <Badge status={order.status} />
              </div>
              <div className="flex items-center justify-between text-sm text-ink-soft">
                <span>{formatDate(order.createdAt)} · {order.items?.length} item(s)</span>
                <span className="font-mono font-semibold text-ink">{formatCurrency(order.totalAmount)}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <Pagination page={result.pageNumber} totalPages={result.totalPages} onPageChange={setPage} />
    </div>
  )
}
