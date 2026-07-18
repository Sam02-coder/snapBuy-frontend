import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { productService } from '../../services/productService'
import { formatCurrency, extractErrorMessage } from '../../utils/formatters'
import { Spinner } from '../../components/ui/Primitives'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { cartService } from '../../services/cartService'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refresh } = useCart()
  const [product, setProduct] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    productService
      .getDetails(id)
      .then((res) => setProduct(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  async function handleAddToCart() {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'CUSTOMER') {
      toast.error('Only customer accounts can add items to a cart')
      return
    }
    setAdding(true)
    try {
      await cartService.add(product.id, quantity)
      await refresh()
      toast.success('Added to cart')
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not add to cart'))
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <Spinner size="lg" />
  if (notFound || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-xl text-navy mb-2">Product not found</p>
        <Link to="/products" className="text-navy font-medium hover:underline">Back to products</Link>
      </div>
    )
  }

  const images = product.images?.length ? product.images : [{ imageUrl: null }]
  const outOfStock = product.stock <= 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-paper-raised border border-line rounded-xl overflow-hidden mb-3">
            {images[activeImage]?.imageUrl ? (
              <img src={images[activeImage].imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-soft/40 font-display text-5xl">
                {product.name?.[0]}
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 rounded-lg border-2 overflow-hidden ${i === activeImage ? 'border-navy' : 'border-line'}`}
                >
                  {img.imageUrl && <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-ink-soft mb-2">{product.categoryName}</p>
          <h1 className="font-display text-3xl text-navy mb-3">{product.name}</h1>
          <p className="font-mono text-2xl text-navy font-semibold mb-5">{formatCurrency(product.price)}</p>

          {product.description && (
            <p className="text-ink-soft leading-relaxed mb-6">{product.description}</p>
          )}

          <p className="text-sm mb-6">
            {outOfStock ? (
              <span className="text-clay font-medium">Out of stock</span>
            ) : (
              <span className="text-sage font-medium">{product.stock} in stock</span>
            )}
          </p>

          {!outOfStock && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-line rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-ink hover:bg-paper"
                >
                  −
                </button>
                <span className="px-4 font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-ink hover:bg-paper"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={outOfStock}
            loading={adding}
            variant="accent"
            size="lg"
            className="w-full sm:w-auto"
          >
            {outOfStock ? 'Out of stock' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </div>
  )
}
