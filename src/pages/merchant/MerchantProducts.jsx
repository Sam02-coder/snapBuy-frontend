import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { productService } from '../../services/productService'
import { Card, Spinner, EmptyState, Badge, Pagination } from '../../components/ui/Primitives'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import { formatCurrency, extractErrorMessage } from '../../utils/formatters'

export default function MerchantProducts() {
  const [result, setResult] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [keyword, page])

  async function load() {
    setLoading(true)
    try {
      const { data } = await productService.listMine({ keyword: keyword || undefined, page, size: 10 })
      setResult(data.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this product from your listing?')) return
    try {
      await productService.remove(id)
      toast.success('Product removed')
      load()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-navy">My Products</h1>
        <Link to="/merchant/products/new">
          <Button variant="accent">+ Add product</Button>
        </Link>
      </div>

      <Input
        placeholder="Search your products..."
        className="max-w-sm mb-6"
        defaultValue={keyword}
        onKeyDown={(e) => e.key === 'Enter' && (setPage(0), setKeyword(e.target.value))}
        onBlur={(e) => { setPage(0); setKeyword(e.target.value) }}
      />

      {loading ? (
        <Spinner />
      ) : !result?.content?.length ? (
        <EmptyState title="No products found" />
      ) : (
        <>
          <Card className="divide-y divide-line">
            {result.content.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <div className="h-14 w-14 shrink-0 bg-paper rounded-lg overflow-hidden flex items-center justify-center">
                  {p.images?.[0]?.imageUrl ? (
                    <img src={p.images[0].imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display text-ink-soft/40">{p.name?.[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{p.name}</p>
                  <p className="text-sm text-ink-soft font-mono">{formatCurrency(p.price)} · Stock: {p.stock}</p>
                  {p.approvalStatus === 'REJECTED' && p.rejectionReason && (
                    <p className="text-xs text-clay mt-1">Rejected: {p.rejectionReason}</p>
                  )}
                </div>
                <Badge status={p.approvalStatus} />
                <div className="flex gap-3 text-sm">
                  <Link to={`/merchant/products/${p.id}/edit`} className="text-navy font-medium hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(p.id)} className="text-clay font-medium hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </Card>
          <Pagination page={result.pageNumber} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
