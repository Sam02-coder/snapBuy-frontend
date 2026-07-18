import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../../context/CartContext'
import { cartService } from '../../services/cartService'
import { formatCurrency, extractErrorMessage } from '../../utils/formatters'
import { Spinner, EmptyState } from '../../components/ui/Primitives'
import Button from '../../components/ui/Button'

export default function Cart() {
  const { cart, loading, refresh } = useCart()
  const navigate = useNavigate()

  async function updateQuantity(itemId, quantity) {
    if (quantity < 1) return
    try {
      await cartService.updateQuantity(itemId, quantity)
      await refresh()
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not update quantity'))
    }
  }

  async function removeItem(itemId) {
    try {
      await cartService.removeItem(itemId)
      await refresh()
      toast.success('Item removed')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  if (loading) return <Spinner size="lg" />

  if (!cart?.items?.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Browse products and add something you like."
          action={
            <Button onClick={() => navigate('/products')} variant="accent">
              Browse products
            </Button>
          }
        />
      </div>
    )
  }

  const hasStockIssue = cart.items.some((item) => item.exceedsAvailableStock)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl text-navy mb-6">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-paper-raised border border-line rounded-xl p-4"
          >
            <div className="h-20 w-20 shrink-0 bg-paper rounded-lg overflow-hidden flex items-center justify-center">
              {item.productImageUrl ? (
                <img src={item.productImageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-xl text-ink-soft/40">{item.productName?.[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink truncate">{item.productName}</p>
              <p className="font-mono text-sm text-navy">{formatCurrency(item.unitPrice)}</p>
              {item.exceedsAvailableStock && (
                <p className="text-xs text-clay mt-1">Only {item.availableStock} left in stock</p>
              )}
            </div>
            <div className="flex items-center border border-line rounded-lg">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2.5 py-1.5 text-ink hover:bg-paper"
              >
                −
              </button>
              <span className="px-3 font-mono text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2.5 py-1.5 text-ink hover:bg-paper"
              >
                +
              </button>
            </div>
            <p className="font-mono font-semibold text-navy w-24 text-right">{formatCurrency(item.subtotal)}</p>
            <button onClick={() => removeItem(item.id)} className="text-ink-soft hover:text-clay text-sm">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="stub-divider pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-ink-soft">Total ({cart.totalItems} items)</span>
          <span className="font-mono text-2xl font-semibold text-navy">{formatCurrency(cart.totalAmount)}</span>
        </div>
        <Button
          onClick={() => navigate('/checkout')}
          disabled={hasStockIssue}
          variant="accent"
          size="lg"
          className="w-full"
        >
          {hasStockIssue ? 'Resolve stock issues to continue' : 'Proceed to checkout'}
        </Button>
      </div>
    </div>
  )
}
