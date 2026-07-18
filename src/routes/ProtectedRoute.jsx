import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  // Mirrors the backend's MerchantFirstLoginFilter: a merchant on a temp
  // password can't reach anything else until they change it.
  if (
    user.role === 'MERCHANT' &&
    user.firstLogin &&
    location.pathname !== '/merchant/change-password'
  ) {
    return <Navigate to="/merchant/change-password" replace />
  }

  return children
}
