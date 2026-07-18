import api from './api'
import { API } from '../constants/api'

export const customerService = {
  getProfile: () => api.get(API.CUSTOMER.PROFILE),
  updateProfile: (payload) => api.put(API.CUSTOMER.PROFILE, payload),
  changePassword: (payload) => api.post(API.CUSTOMER.CHANGE_PASSWORD, payload),

  listAddresses: () => api.get(API.CUSTOMER.ADDRESSES),
  addAddress: (payload) => api.post(API.CUSTOMER.ADDRESSES, payload),
  updateAddress: (id, payload) => api.put(API.CUSTOMER.ADDRESS(id), payload),
  removeAddress: (id) => api.delete(API.CUSTOMER.ADDRESS(id)),
  setDefaultAddress: (id) => api.patch(API.CUSTOMER.ADDRESS_DEFAULT(id)),
}
