import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { productService } from '../../services/productService'
import { Card, Spinner, EmptyState, Badge, Pagination } from '../../components/ui/Primitives'
import { Select, TextArea } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { formatCurrency, extractErrorMessage } from '../../utils/formatters'

export default function ProductApproval() {
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('PENDING')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [rejectingProduct, setRejectingProduct] = useState(null)

  useEffect(() => {
    load()
  }, [status, page])

  async function load() {
    setLoading(true)
    try {
      const { data } = await productService.listForAdmin({ status: status || undefined, page, size: 10 })
      setResult(data.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id) {
    try {
      await productService.approve(id)
      toast.success('Product approved')
      load()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-navy">Product Approval</h1>
        <Select value={status} onChange={(e) => { setPage(0); setStatus(e.target.value) }} className="max-w-[200px]">
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="">All</option>
        </Select>
      </div>

      {loading ? (
        <Spinner />
      ) : !result?.content?.length ? (
        <EmptyState title="No products in this filter" />
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
                  <p className="text-sm text-ink-soft font-mono">{formatCurrency(p.price)} · {p.merchantBusinessName || `Merchant #${p.merchantId}`}</p>
                  {p.rejectionReason && <p className="text-xs text-clay mt-1">Reason: {p.rejectionReason}</p>}
                </div>
                <Badge status={p.approvalStatus} />
                {p.approvalStatus === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(p.id)}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => setRejectingProduct(p)}>Reject</Button>
                  </div>
                )}
              </div>
            ))}
          </Card>
          <Pagination page={result.pageNumber} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      )}

      <RejectModal
        product={rejectingProduct}
        onClose={() => setRejectingProduct(null)}
        onRejected={() => { setRejectingProduct(null); load() }}
      />
    </div>
  )
}

function RejectModal({ product, onClose, onRejected }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    try {
      await productService.reject(product.id, values.reason)
      toast.success('Product rejected')
      reset()
      onRejected()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <Modal open={!!product} onClose={onClose} title={`Reject "${product?.name}"`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextArea
          label="Rejection reason"
          rows={4}
          placeholder="Let the merchant know what needs to change..."
          error={errors.reason?.message}
          {...register('reason', { required: 'Please provide a reason' })}
        />
        <Button type="submit" loading={isSubmitting} variant="danger" className="w-full">
          Confirm rejection
        </Button>
      </form>
    </Modal>
  )
}
