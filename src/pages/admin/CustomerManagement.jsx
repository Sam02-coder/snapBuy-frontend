import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminService } from '../../services/adminService'
import { Card, Spinner, EmptyState, Pagination } from '../../components/ui/Primitives'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import { formatDate, extractErrorMessage } from '../../utils/formatters'

export default function CustomerManagement() {
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
      const { data } = await adminService.listCustomers({ keyword: keyword || undefined, page, size: 10 })
      setResult(data.data)
    } finally {
      setLoading(false)
    }
  }

  async function toggleBlock(customer) {
    try {
      if (customer.locked) {
        await adminService.unblockCustomer(customer.id)
        toast.success('Customer unblocked')
      } else {
        await adminService.blockCustomer(customer.id)
        toast.success('Customer blocked')
      }
      load()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-navy mb-6">Customers</h1>

      <Input
        placeholder="Search by name or email..."
        className="max-w-sm mb-6"
        defaultValue={keyword}
        onKeyDown={(e) => e.key === 'Enter' && (setPage(0), setKeyword(e.target.value))}
        onBlur={(e) => { setPage(0); setKeyword(e.target.value) }}
      />

      {loading ? (
        <Spinner />
      ) : !result?.content?.length ? (
        <EmptyState title="No customers found" />
      ) : (
        <>
          <Card className="divide-y divide-line">
            {result.content.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-ink">{c.fullName}</p>
                  <p className="text-sm text-ink-soft">{c.email}</p>
                  <p className="text-xs text-ink-soft mt-0.5">Joined {formatDate(c.createdAt)}</p>
                </div>
                <Button size="sm" variant={c.locked ? 'outline' : 'danger'} onClick={() => toggleBlock(c)}>
                  {c.locked ? 'Unblock' : 'Block'}
                </Button>
              </div>
            ))}
          </Card>
          <Pagination page={result.pageNumber} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
