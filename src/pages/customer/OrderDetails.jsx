import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { orderService } from '../../services/orderService'
import { Card, Spinner, Badge } from '../../components/ui/Primitives'
import Button from '../../components/ui/Button'
import { formatCurrency, formatDateTime, extractErrorMessage } from '../../utils/formatters'

const CANCELLABLE = ['PENDING', 'CONFIRMED']

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    setLoading(true)
    try {
      const { data } = await orderService.getDetails(id)
      setOrder(data.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm('Cancel this order?')) return
    setCancelling(true)
    try {
      await orderService.cancel(id)
      toast.success('Order cancelled')
      load()
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not cancel order'))
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <Spinner />
  if (!order) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-navy">Order #{order.id}</h2>
          <p className="text-sm text-ink-soft">{formatDateTime(order.createdAt)}</p>
        </div>
        <Badge status={order.status} />
      </div>

      <Card className="p-5 mb-5">
        <h3 className="font-medium text-ink mb-3">Items</h3>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 bg-paper rounded-lg overflow-hidden flex items-center justify-center">
                {item.productImageUrl ? (
                  <img src={item.productImageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display text-ink-soft/40">{item.productName?.[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{item.productName}</p>
                <p className="text-xs text-ink-soft">
                  {item.quantity} × {formatCurrency(item.priceAtPurchase)}
                </p>
              </div>
              <p className="font-mono text-sm font-semibold">{formatCurrency(item.subtotal)}</p>
            </div>
          ))}
        </div>
        <div className="stub-divider pt-4 mt-4 flex justify-between">
          <span className="font-medium">Total</span>
          <span className="font-mono text-lg font-semibold text-navy">{formatCurrency(order.totalAmount)}</span>
        </div>
      </Card>

      {order.deliveryAddress && (
        <Card className="p-5 mb-5">
          <h3 className="font-medium text-ink mb-2">Delivery address</h3>
          <p className="text-sm text-ink-soft">
            {order.deliveryAddress.addressLine1}, {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
            {order.deliveryAddress.postalCode}
          </p>
        </Card>
      )}

      {CANCELLABLE.includes(order.status) && (
        <Button onClick={handleCancel} loading={cancelling} variant="danger">
          Cancel order
        </Button>
      )}
    </div>
  )
}
