import api, { tokenStorage } from './api'
import { API } from '../constants/api'

export const authService = {
  register: (payload) => api.post(API.AUTH.REGISTER, payload, { _skipAuth: true }),
  verifyOtp: (payload) => api.post(API.AUTH.VERIFY_OTP, payload, { _skipAuth: true }),
  resendOtp: (payload) => api.post(API.AUTH.RESEND_OTP, payload, { _skipAuth: true }),
  forgotPassword: (payload) => api.post(API.AUTH.FORGOT_PASSWORD, payload, { _skipAuth: true }),
  resetPassword: (payload) => api.post(API.AUTH.RESET_PASSWORD, payload, { _skipAuth: true }),

  login: async (payload) => {
    const { data } = await api.post(API.AUTH.LOGIN, payload, { _skipAuth: true })
    const { accessToken, refreshToken, userId, email, role, firstLogin } = data.data
    const user = { userId, email, role, firstLogin }
    tokenStorage.setSession({ accessToken, refreshToken, user })
    return user
  },

  logout: async () => {
    const refreshToken = tokenStorage.getRefreshToken()
    try {
      await api.post(API.AUTH.LOGOUT, { refreshToken })
    } finally {
      tokenStorage.clear()
    }
  },
}
