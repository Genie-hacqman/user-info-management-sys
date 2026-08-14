import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const role = String(user?.role || '').toLowerCase()

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  if (role !== 'admin') {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />
  }

  return children
}
