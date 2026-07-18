import api from './api'
import { API } from '../constants/api'

export const orderService = {
  checkout: (addressId) => api.post(API.CUSTOMER.CHECKOUT, { addressId }),
  history: (params) => api.get(API.CUSTOMER.ORDERS, { params }),
  getDetails: (id) => api.get(API.CUSTOMER.ORDER(id)),
  cancel: (id) => api.patch(API.CUSTOMER.ORDER_CANCEL(id)),
}

export const paymentService = {
  createRazorpayOrder: (orderId) => api.post(API.CUSTOMER.PAYMENT_CREATE(orderId)),
  verify: (payload) => api.post(API.CUSTOMER.PAYMENT_VERIFY, payload),
  history: (params) => api.get(API.CUSTOMER.PAYMENTS, { params }),
}
