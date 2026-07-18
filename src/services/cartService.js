import api from './api'
import { API } from '../constants/api'

export const cartService = {
  get: () => api.get(API.CUSTOMER.CART),
  add: (productId, quantity) => api.post(API.CUSTOMER.CART_ITEMS, { productId, quantity }),
  updateQuantity: (itemId, quantity) => api.put(API.CUSTOMER.CART_ITEM(itemId), { quantity }),
  removeItem: (itemId) => api.delete(API.CUSTOMER.CART_ITEM(itemId)),
  clear: () => api.delete(API.CUSTOMER.CART),
}
