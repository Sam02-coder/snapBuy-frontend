import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productService, categoryService } from '../../services/productService'
import ProductCard from '../../components/product/ProductCard'
import { Spinner } from '../../components/ui/Primitives'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.browse({ page: 0, size: 8, sortBy: 'createdAt', sortDir: 'desc' }),
          categoryService.listActive(),
        ])
        setProducts(productsRes.data.data.content)
        setCategories(categoriesRes.data.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div>
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-marigold mb-4">
            Fresh stock, every day
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
            Everything you need, from sellers you can trust
          </h1>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Browse thousands of products across every category, backed by verified merchants.
          </p>
          <Link
            to="/products"
            className="inline-block bg-marigold text-navy font-semibold px-6 py-3 rounded-lg hover:brightness-95"
          >
            Start shopping
          </Link>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="font-display text-2xl text-navy mb-6">Shop by category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="px-4 py-2 rounded-full border border-line bg-paper-raised text-sm font-medium text-ink hover:border-navy hover:text-navy transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-navy">Newest arrivals</h2>
          <Link to="/products" className="text-sm font-medium text-navy hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
