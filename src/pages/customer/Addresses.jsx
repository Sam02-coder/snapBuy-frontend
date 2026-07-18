import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { customerService } from '../../services/customerService'
import { Card, Spinner, EmptyState } from '../../components/ui/Primitives'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { extractErrorMessage } from '../../utils/formatters'

export default function Addresses() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data } = await customerService.listAddresses()
      setAddresses(data.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this address?')) return
    try {
      await customerService.removeAddress(id)
      toast.success('Address deleted')
      load()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function handleSetDefault(id) {
    try {
      await customerService.setDefaultAddress(id)
      toast.success('Default address updated')
      load()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className="flex justify-end mb-5">
        <Button onClick={() => { setEditingAddress(null); setShowModal(true) }}>+ Add address</Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState title="No saved addresses" description="Add one for faster checkout." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card key={addr.id} className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-ink">{addr.addressLine1}</p>
                {addr.isDefault && <span className="text-xs text-sage font-semibold shrink-0">Default</span>}
              </div>
              {addr.addressLine2 && <p className="text-sm text-ink-soft">{addr.addressLine2}</p>}
              <p className="text-sm text-ink-soft">{addr.city}, {addr.state} {addr.postalCode}</p>
              <p className="text-sm text-ink-soft mb-3">{addr.country} · {addr.phone}</p>
              <div className="flex gap-4 text-sm">
                <button onClick={() => { setEditingAddress(addr); setShowModal(true) }} className="text-navy font-medium hover:underline">Edit</button>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-navy font-medium hover:underline">Set as default</button>
                )}
                <button onClick={() => handleDelete(addr.id)} className="text-clay font-medium hover:underline">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddressModal
        open={showModal}
        address={editingAddress}
        onClose={() => setShowModal(false)}
        onSaved={() => { setShowModal(false); load() }}
      />
    </div>
  )
}

function AddressModal({ open, address, onClose, onSaved }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ values: address || {} })

  async function onSubmit(values) {
    try {
      if (address) {
        await customerService.updateAddress(address.id, values)
        toast.success('Address updated')
      } else {
        await customerService.addAddress(values)
        toast.success('Address added')
      }
      reset()
      onSaved()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={address ? 'Edit address' : 'Add address'}>
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
        <Button type="submit" loading={isSubmitting} className="w-full">Save</Button>
      </form>
    </Modal>
  )
}
