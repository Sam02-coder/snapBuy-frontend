import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { adminService } from '../../services/adminService'
import { Card, Spinner, EmptyState, Pagination } from '../../components/ui/Primitives'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { formatDate, extractErrorMessage } from '../../utils/formatters'

export default function MerchantManagement() {
  const [result, setResult] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    load()
  }, [keyword, page])

  async function load() {
    setLoading(true)
    try {
      const { data } = await adminService.listMerchants({ keyword: keyword || undefined, page, size: 10 })
      setResult(data.data)
    } finally {
      setLoading(false)
    }
  }

  async function toggleBlock(merchant) {
    try {
      if (merchant.locked) {
        await adminService.unblockMerchant(merchant.id)
        toast.success('Merchant unblocked')
      } else {
        await adminService.blockMerchant(merchant.id)
        toast.success('Merchant blocked')
      }
      load()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-navy">Merchants</h1>
        <Button variant="accent" onClick={() => setShowCreate(true)}>+ Create merchant</Button>
      </div>

      <Input
        placeholder="Search by business name or email..."
        className="max-w-sm mb-6"
        defaultValue={keyword}
        onKeyDown={(e) => e.key === 'Enter' && (setPage(0), setKeyword(e.target.value))}
        onBlur={(e) => { setPage(0); setKeyword(e.target.value) }}
      />

      {loading ? (
        <Spinner />
      ) : !result?.content?.length ? (
        <EmptyState title="No merchants found" />
      ) : (
        <>
          <Card className="divide-y divide-line">
            {result.content.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-ink">{m.businessName}</p>
                  <p className="text-sm text-ink-soft">{m.email}</p>
                  <p className="text-xs text-ink-soft mt-0.5">
                    Joined {formatDate(m.createdAt)} · {m.firstLogin ? 'Awaiting first login' : 'Active'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={m.locked ? 'outline' : 'danger'}
                  onClick={() => toggleBlock(m)}
                >
                  {m.locked ? 'Unblock' : 'Block'}
                </Button>
              </div>
            ))}
          </Card>
          <Pagination page={result.pageNumber} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      )}

      <CreateMerchantModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load() }} />
    </div>
  )
}

function CreateMerchantModal({ open, onClose, onCreated }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    try {
      await adminService.createMerchant(values)
      toast.success('Merchant created. Credentials sent by email.')
      reset()
      onCreated()
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not create merchant'))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create merchant">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Required' })} />
        <Input label="Business name" error={errors.businessName?.message} {...register('businessName', { required: 'Required' })} />
        <Input label="GST number (optional)" {...register('gstNumber')} />
        <Input label="Contact phone" error={errors.contactPhone?.message} {...register('contactPhone', { required: 'Required' })} />
        <Button type="submit" loading={isSubmitting} className="w-full">Create &amp; send credentials</Button>
      </form>
    </Modal>
  )
}
