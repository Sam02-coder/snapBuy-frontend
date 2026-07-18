import api from './api'
import { API } from '../constants/api'

export const productService = {
  browse: (params) => api.get(API.PRODUCTS.LIST, { params }),
  getDetails: (id) => api.get(API.PRODUCTS.DETAILS(id)),
  byCategory: (id, params) => api.get(API.PRODUCTS.BY_CATEGORY(id), { params }),

  // Merchant
  create: (payload) => api.post(API.MERCHANT.PRODUCTS, payload),
  update: (id, payload) => api.put(API.MERCHANT.PRODUCT(id), payload),
  remove: (id) => api.delete(API.MERCHANT.PRODUCT(id)),
  listMine: (params) => api.get(API.MERCHANT.PRODUCTS, { params }),
  getMine: (id) => api.get(API.MERCHANT.PRODUCT(id)),
  uploadImages: (id, files) => {
    const formData = new FormData()
    files.forEach((f) => formData.append('files', f))
    return api.post(API.MERCHANT.PRODUCT_IMAGES(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  updateStock: (id, stock) => api.patch(API.MERCHANT.PRODUCT_STOCK(id), { stock }),

  // Admin
  listForAdmin: (params) => api.get(API.ADMIN.PRODUCTS, { params }),
  approve: (id) => api.patch(API.ADMIN.PRODUCT_APPROVE(id)),
  reject: (id, reason) => api.patch(API.ADMIN.PRODUCT_REJECT(id), { reason }),
}

export const categoryService = {
  listActive: () => api.get(API.CATEGORIES.LIST),
  getDetails: (id) => api.get(API.CATEGORIES.DETAILS(id)),

  // Admin
  listAll: () => api.get(API.ADMIN.CATEGORIES),
  create: (payload) => api.post(API.ADMIN.CATEGORIES, payload),
  update: (id, payload) => api.put(API.ADMIN.CATEGORY(id), payload),
  remove: (id) => api.delete(API.ADMIN.CATEGORY(id)),
}
