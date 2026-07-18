import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { customerService } from '../../services/customerService'
import { orderService, paymentService } from '../../services/orderService'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, extractErrorMessage } from '../../utils/formatters'
import { Spinner } from '../../components/ui/Primitives'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { useRazorpayScript } from '../../hooks/useRazorpayScript'

export default function Checkout() {
  const { cart, loading: cartLoading, refresh: refreshCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const razorpayReady = useRazorpayScript()

  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)

  useEffect(() => {
    loadAddresses()
  }, [])

  async function loadAddresses() {
    setLoadingAddresses(true)
    try {
      const { data } = await customerService.listAddresses()
      setAddresses(data.data)
      const defaultAddr = data.data.find((a) => a.isDefault) || data.data[0]
      if (defaultAddr) setSelectedAddressId(defaultAddr.id)
    } finally {
      setLoadingAddresses(false)
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address')
      return
    }
    if (!razorpayReady) {
      toast.error('Payment gateway is still loading, please wait a moment')
      return
    }

    setPlacing(true)
    try {
      const { data: orderRes } = await orderService.checkout(selectedAddressId)
      const order = orderRes.data

      const { data: paymentRes } = await paymentService.createRazorpayOrder(order.id)
      const payment = paymentRes.data

      const razorpay = new window.Razorpay({
        key: payment.razorpayKeyId,
        amount: payment.amountInPaise,
        currency: payment.currency,
        name: 'ShopSphere',
        description: `Order #${order.id}`,
        order_id: payment.razorpayOrderId,
        prefill: { email: user?.email },
        theme: { color: '#1f2a44' },
        handler: async (response) => {
          try {
            await paymentService.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            await refreshCart()
            toast.success('Payment successful! Order confirmed.')
            navigate(`/account/orders/${order.id}`)
          } catch (error) {
            toast.error(extractErrorMessage(error, 'Payment verification failed'))
            navigate(`/account/orders/${order.id}`)
          }
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled. Your order is saved as pending.', { icon: 'ℹ️' })
            navigate(`/account/orders/${order.id}`)
          },
        },
      })
      razorpay.open()
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not place order'))
    } finally {
      setPlacing(false)
    }
  }

  if (cartLoading || loadingAddresses) return <Spinner size="lg" />

  if (!cart?.items?.length) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl text-navy mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Delivery Address</h2>
            <button
              onClick={() => setShowAddAddress(true)}
              className="text-sm text-navy font-medium hover:underline"
            >
              + Add new address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-sm text-ink-soft">No saved addresses. Add one to continue.</p>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`block border rounded-xl p-4 cursor-pointer transition-colors ${
                    selectedAddressId === addr.id ? 'border-navy bg-paper-raised' : 'border-line'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-ink">
                        {addr.addressLine1}
                        {addr.isDefault && (
                          <span className="ml-2 text-xs text-sage font-semibold">Default</span>
                        )}
                      </p>
                      {addr.addressLine2 && <p className="text-ink-soft">{addr.addressLine2}</p>}
                      <p className="text-ink-soft">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-ink-soft">{addr.phone}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="bg-paper-raised border border-line rounded-xl p-5 h-fit">
          <h2 className="font-semibold text-ink mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-ink-soft truncate pr-2">
                  {item.productName} × {item.quantity}
                </span>
                <span className="font-mono">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="stub-divider pt-4 flex justify-between items-center mb-5">
            <span className="font-medium">Total</span>
            <span className="font-mono text-xl font-semibold text-navy">{formatCurrency(cart.totalAmount)}</span>
          </div>
          <Button onClick={handlePlaceOrder} loading={placing} variant="accent" className="w-full">
            Pay with Razorpay
          </Button>
        </div>
      </div>

      <AddAddressModal
        open={showAddAddress}
        onClose={() => setShowAddAddress(false)}
        onAdded={() => {
          setShowAddAddress(false)
          loadAddresses()
        }}
      />
    </div>
  )
}

function AddAddressModal({ open, onClose, onAdded }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    try {
      await customerService.addAddress(values)
      toast.success('Address added')
      reset()
      onAdded()
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not add address'))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add delivery address">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input label="Address line 1" error={errors.addressLine1?.message} {...register('addressLine1', { required: 'Required' })} />
        <Input label="Address line 2 (optional)" {...register('addressLine2')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="City" error={errors.city?.message} {...register('city', { required: 'Required' })} />
          <Input label="State" error={errors.state?.message} {...register('state', { required: 'Required' })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Postal code" error={errors.postalCode?.message} {...register('postalCode', { required: 'Required' })} />
          <Input label="Country" defaultValue="India" error={errors.country?.message} {...register('country', { required: 'Required' })} />
        </div>
        <Input label="Phone" error={errors.phone?.message} {...register('phone', { required: 'Required' })} />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" {...register('isDefault')} />
          Set as default address
        </label>
        <Button type="submit" loading={isSubmitting} className="w-full">Save address</Button>
      </form>
    </Modal>
  )
}
