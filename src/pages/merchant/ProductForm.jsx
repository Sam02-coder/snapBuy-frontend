import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { productService, categoryService } from '../../services/productService'
import { Input, TextArea, Select } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import { Card, Spinner } from '../../components/ui/Primitives'
import { extractErrorMessage } from '../../utils/formatters'

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [uploading, setUploading] = useState(false)
  const [stockValue, setStockValue] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    async function load() {
      const { data: catRes } = await categoryService.listActive()
      setCategories(catRes.data)

      if (isEdit) {
        const { data } = await productService.getMine(id)
        setProduct(data.data)
        setStockValue(String(data.data.stock))
        reset({
          categoryId: data.data.categoryId,
          name: data.data.name,
          description: data.data.description,
          price: data.data.price,
        })
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function onSubmit(values) {
    const payload = {
      categoryId: Number(values.categoryId),
      name: values.name,
      description: values.description,
      price: Number(values.price),
    }
    try {
      if (isEdit) {
        await productService.update(id, payload)
        toast.success('Product updated, pending re-approval')
        navigate('/merchant/products')
      } else {
        const { data } = await productService.create({ ...payload, stock: Number(values.stock) })
        toast.success('Product created, pending admin approval')
        navigate(`/merchant/products/${data.data.id}/edit`)
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not save product'))
    }
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const { data } = await productService.uploadImages(id, files)
      setProduct(data.data)
      toast.success('Images uploaded')
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not upload images'))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleStockUpdate() {
    try {
      await productService.updateStock(id, Number(stockValue))
      toast.success('Stock updated')
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not update stock'))
    }
  }

  if (loading) return <Spinner size="lg" />

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-navy mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <Card className="p-6 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Category" error={errors.categoryId?.message} {...register('categoryId', { required: 'Required' })}>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Input label="Product name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
          <TextArea label="Description" rows={4} {...register('description')} />
          <Input
            label="Price (₹)"
            type="number"
            step="0.01"
            error={errors.price?.message}
            {...register('price', { required: 'Required', min: { value: 0.01, message: 'Must be greater than 0' } })}
          />
          {!isEdit && (
            <Input
              label="Initial stock"
              type="number"
              error={errors.stock?.message}
              {...register('stock', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })}
            />
          )}
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
        </form>
      </Card>

      {isEdit && (
        <>
          <Card className="p-6 mb-6">
            <h2 className="font-medium text-ink mb-3">Update stock</h2>
            <div className="flex gap-3">
              <Input type="number" value={stockValue} onChange={(e) => setStockValue(e.target.value)} className="max-w-[140px]" />
              <Button onClick={handleStockUpdate} variant="outline">Update</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-medium text-ink mb-3">Product images</h2>
            {product?.images?.length > 0 && (
              <div className="flex gap-3 mb-4 flex-wrap">
                {product.images.map((img) => (
                  <img key={img.id} src={img.imageUrl} alt="" className="h-20 w-20 object-cover rounded-lg border border-line" />
                ))}
              </div>
            )}
            <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-ink-soft mt-2">Uploading...</p>}
          </Card>
        </>
      )}
    </div>
  )
}
