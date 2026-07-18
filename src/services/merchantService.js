import api from './api'
import { API } from '../constants/api'

export const merchantService = {
  getProfile: () => api.get(API.MERCHANT.PROFILE),
  updateProfile: (payload) => api.put(API.MERCHANT.PROFILE, payload),
  changePassword: (payload) => api.post(API.MERCHANT.CHANGE_PASSWORD, payload),
  firstLoginChangePassword: (payload) => api.post(API.MERCHANT.FIRST_LOGIN_CHANGE_PASSWORD, payload),
}
