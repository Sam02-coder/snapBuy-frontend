import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productService, categoryService } from '../../services/productService'
import ProductCard from '../../components/product/ProductCard'
import { Spinner, EmptyState, Pagination } from '../../components/ui/Primitives'
import { Input, Select } from '../../components/ui/FormFields'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [result, setResult] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const keyword = searchParams.get('keyword') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortDir = searchParams.get('sortDir') || 'desc'
  const page = Number(searchParams.get('page') || 0)

  useEffect(() => {
    categoryService.listActive().then((res) => setCategories(res.data.data))
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await productService.browse({
        keyword: keyword || undefined,
        categoryId: categoryId || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy,
        sortDir,
        page,
        size: 12,
      })
      setResult(data.data)
    } finally {
      setLoading(false)
    }
  }, [keyword, categoryId, minPrice, maxPrice, sortBy, sortDir, page])

  useEffect(() => {
    load()
  }, [load])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '0')
    setSearchParams(next)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl text-navy mb-6">
        {categoryId ? categories.find((c) => String(c.id) === categoryId)?.name || 'Products' : 'All Products'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Filters */}
        <aside className="space-y-5">
          <Input
            label="Search"
            placeholder="Search products..."
            defaultValue={keyword}
            onKeyDown={(e) => e.key === 'Enter' && updateParam('keyword', e.target.value)}
            onBlur={(e) => updateParam('keyword', e.target.value)}
          />
          <Select label="Category" value={categoryId} onChange={(e) => updateParam('categoryId', e.target.value)}>
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Min price"
              type="number"
              defaultValue={minPrice}
              onBlur={(e) => updateParam('minPrice', e.target.value)}
            />
            <Input
              label="Max price"
              type="number"
              defaultValue={maxPrice}
              onBlur={(e) => updateParam('maxPrice', e.target.value)}
            />
          </div>
          <Select
            label="Sort by"
            value={`${sortBy}:${sortDir}`}
            onChange={(e) => {
              const [sb, sd] = e.target.value.split(':')
              const next = new URLSearchParams(searchParams)
              next.set('sortBy', sb)
              next.set('sortDir', sd)
              next.set('page', '0')
              setSearchParams(next)
            }}
          >
            <option value="createdAt:desc">Newest first</option>
            <option value="price:asc">Price: low to high</option>
            <option value="price:desc">Price: high to low</option>
            <option value="name:asc">Name: A to Z</option>
          </Select>
        </aside>

        {/* Results */}
        <div>
          {loading ? (
            <Spinner />
          ) : result?.content?.length ? (
            <>
              <p className="text-sm text-ink-soft mb-4">{result.totalElements} products found</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {result.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                page={result.pageNumber}
                totalPages={result.totalPages}
                onPageChange={(p) => {
                  const next = new URLSearchParams(searchParams)
                  next.set('page', String(p))
                  setSearchParams(next)
                }}
              />
            </>
          ) : (
            <EmptyState title="No products found" description="Try adjusting your filters." />
          )}
        </div>
      </div>
    </div>
  )
}
