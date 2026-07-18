import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatters'

export default function ProductCard({ product }) {
  const imageUrl = product.images?.[0]?.imageUrl
  const outOfStock = product.stock <= 0

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-paper-raised border border-line rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-paper relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-soft/40 font-display text-3xl">
            {product.name?.[0]}
          </div>
        )}
        {outOfStock && (
          <span className="absolute top-2 left-2 bg-clay text-white text-xs font-semibold px-2 py-1 rounded-full">
            Out of stock
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-ink-soft mb-1 truncate">{product.categoryName}</p>
        <h3 className="font-sans font-semibold text-ink truncate">{product.name}</h3>
        <p className="font-mono text-navy font-semibold mt-1.5">{formatCurrency(product.price)}</p>
      </div>
    </Link>
  )
}
