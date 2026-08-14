import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AdminLayout from '../layouts/AdminLayout'
import Home from '../pages/Home'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import DashboardPage from '../pages/dashboard/Dashboard'
import ProfilePage from '../pages/dashboard/Profile'
import EditProfilePage from '../pages/dashboard/EditProfile'
import ChangePasswordPage from '../pages/dashboard/ChangePassword'
import SettingsPage from '../pages/dashboard/Settings'
import NotificationsPage from '../pages/dashboard/Notifications'
import AdminDashboardPage from '../pages/admin/AdminDashboard'
import UsersPage from '../pages/admin/Users'
import UserDirectoryPage from '../pages/admin/UserDirectory'
import UserDetailsPage from '../pages/admin/UserDetails'
import ReportsPage from '../pages/admin/Reports'
import ActivityPage from '../pages/admin/Activity'
import AdminSettingsPage from '../pages/admin/Settings'
import UnauthorizedPage from '../pages/Unauthorized'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<AuthLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="edit-profile" element={<EditProfilePage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users-directory" element={<UserDirectoryPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<UserDetailsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
