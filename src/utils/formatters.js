export function formatCurrency(amount) {
  const value = Number(amount ?? 0)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  if (!data) return fallback
  if (data.data && typeof data.data === 'object') {
    const firstField = Object.values(data.data)[0]
    if (firstField) return firstField
  }
  return data.message || fallback
}

export function statusBadgeClasses(status) {
  const map = {
    PENDING: 'bg-marigold-soft text-navy',
    APPROVED: 'bg-sage-soft text-sage',
    CONFIRMED: 'bg-sage-soft text-sage',
    REJECTED: 'bg-clay-soft text-clay',
    CANCELLED: 'bg-clay-soft text-clay',
    SHIPPED: 'bg-marigold-soft text-navy',
    DELIVERED: 'bg-sage-soft text-sage',
    SUCCESS: 'bg-sage-soft text-sage',
    FAILED: 'bg-clay-soft text-clay',
    CREATED: 'bg-marigold-soft text-navy',
  }
  return map[status] || 'bg-line text-ink-soft'
}
