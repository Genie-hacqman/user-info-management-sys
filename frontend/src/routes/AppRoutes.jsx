import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/Home';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import UnauthorizedPage from '../pages/Unauthorized';
import LoadingSpinner from '../components/LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
const DashboardPage = lazy(() => import('../pages/dashboard/Dashboard'));
const ProfilePage = lazy(() => import('../pages/dashboard/Profile'));
const EditProfilePage = lazy(() => import('../pages/dashboard/EditProfile'));
const ChangePasswordPage = lazy(() => import('../pages/dashboard/ChangePassword'));
const SettingsPage = lazy(() => import('../pages/dashboard/Settings'));
const NotificationsPage = lazy(() => import('../pages/dashboard/Notifications'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboard'));
const UsersPage = lazy(() => import('../pages/admin/Users'));
const UserDirectoryPage = lazy(() => import('../pages/admin/UserDirectory'));
const UserDetailsPage = lazy(() => import('../pages/admin/UserDetails'));
const ReportsPage = lazy(() => import('../pages/admin/Reports'));
const ActivityPage = lazy(() => import('../pages/admin/Activity'));
const AdminSettingsPage = lazy(() => import('../pages/admin/Settings'));
const loadingFallback = <div className="flex min-h-50 w-full items-center justify-center px-4 py-10">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <LoadingSpinner size="md" />
        <div className="space-y-2">
          <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="h-2.5 w-40 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  </div>;
export default function AppRoutes() {
  return <Suspense fallback={loadingFallback}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route path="/dashboard" element={<ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        <Route path="/admin" element={<AdminRoute>
              <AdminLayout />
            </AdminRoute>}>
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
    </Suspense>;
}
