import { useEffect, useState } from 'react'
import { paymentService } from '../../services/orderService'
import { Card, Spinner, EmptyState, Badge, Pagination } from '../../components/ui/Primitives'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

export default function PaymentHistory() {
  const [result, setResult] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    paymentService.history({ page, size: 10 }).then((res) => setResult(res.data.data)).finally(() => setLoading(false))
  }, [page])

  if (loading) return <Spinner />

  if (!result?.content?.length) {
    return <EmptyState title="No payments yet" description="Completed payments will show up here." />
  }

  return (
    <div>
      <div className="space-y-3">
        {result.content.map((payment) => (
          <Card key={payment.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Order #{payment.orderId}</p>
              <p className="text-xs text-ink-soft font-mono">{payment.razorpayOrderId}</p>
              <p className="text-xs text-ink-soft mt-0.5">{formatDateTime(payment.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-semibold text-navy mb-1">{formatCurrency(payment.amount)}</p>
              <Badge status={payment.status} />
            </div>
          </Card>
        ))}
      </div>
      <Pagination page={result.pageNumber} totalPages={result.totalPages} onPageChange={setPage} />
    </div>
  )
}
