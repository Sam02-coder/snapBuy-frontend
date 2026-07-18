import api from './api'
import { API } from '../constants/api'

export const adminService = {
  // Merchants
  listMerchants: (params) => api.get(API.ADMIN.MERCHANTS, { params }),
  getMerchant: (id) => api.get(API.ADMIN.MERCHANT(id)),
  createMerchant: (payload) => api.post(API.ADMIN.MERCHANTS, payload),
  updateMerchant: (id, payload) => api.put(API.ADMIN.MERCHANT(id), payload),
  deleteMerchant: (id) => api.delete(API.ADMIN.MERCHANT(id)),
  blockMerchant: (id) => api.patch(API.ADMIN.MERCHANT_BLOCK(id)),
  unblockMerchant: (id) => api.patch(API.ADMIN.MERCHANT_UNBLOCK(id)),

  // Customers
  listCustomers: (params) => api.get(API.ADMIN.CUSTOMERS, { params }),
  getCustomer: (id) => api.get(API.ADMIN.CUSTOMER(id)),
  blockCustomer: (id) => api.patch(API.ADMIN.CUSTOMER_BLOCK(id)),
  unblockCustomer: (id) => api.patch(API.ADMIN.CUSTOMER_UNBLOCK(id)),
}
