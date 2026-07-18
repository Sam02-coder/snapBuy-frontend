import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { categoryService } from '../../services/productService'
import { Card, Spinner, EmptyState } from '../../components/ui/Primitives'
import { Input, TextArea } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { extractErrorMessage } from '../../utils/formatters'

export default function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data } = await categoryService.listAll()
      setCategories(data.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeactivate(id) {
    if (!confirm('Deactivate this category?')) return
    try {
      await categoryService.remove(id)
      toast.success('Category deactivated')
      load()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  if (loading) return <Spinner size="lg" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-navy">Categories</h1>
        <Button variant="accent" onClick={() => { setEditingCategory(null); setShowModal(true) }}>
          + Add category
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No categories yet" />
      ) : (
        <Card className="divide-y divide-line">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-ink">
                  {cat.name}
                  {!cat.active && <span className="ml-2 text-xs text-clay font-semibold">Inactive</span>}
                </p>
                {cat.description && <p className="text-sm text-ink-soft">{cat.description}</p>}
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => { setEditingCategory(cat); setShowModal(true) }} className="text-navy font-medium hover:underline">Edit</button>
                {cat.active && (
                  <button onClick={() => handleDeactivate(cat.id)} className="text-clay font-medium hover:underline">Deactivate</button>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}

      <CategoryModal
        open={showModal}
        category={editingCategory}
        onClose={() => setShowModal(false)}
        onSaved={() => { setShowModal(false); load() }}
      />
    </div>
  )
}

function CategoryModal({ open, category, onClose, onSaved }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ values: category ? { name: category.name, description: category.description, active: category.active } : { active: true } })

  async function onSubmit(values) {
    try {
      if (category) {
        await categoryService.update(category.id, { ...values, active: values.active !== false })
        toast.success('Category updated')
      } else {
        await categoryService.create(values)
        toast.success('Category created')
      }
      reset()
      onSaved()
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not save category'))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={category ? 'Edit category' : 'Add category'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
        <TextArea label="Description" rows={3} {...register('description')} />
        {category && (
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" {...register('active')} />
            Active
          </label>
        )}
        <Button type="submit" loading={isSubmitting} className="w-full">Save</Button>
      </form>
    </Modal>
  )
}
