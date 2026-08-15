import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle, Calendar, Shield, AlertCircle, LogOut, Settings, Bell, User } from 'lucide-react';
const getSettings = () => {
  try {
    return JSON.parse(localStorage.getItem('sly-user-settings') || '{}');
  } catch {
    return {};
  }
};
const localeMap = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  Arabic: 'ar-EG'
};
const formatDate = (date, options = {}) => {
  const settings = getSettings();
  const locale = localeMap[settings.language] || 'en-US';
  const timeZone = settings.timezone || 'UTC';
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    ...options
  }).format(new Date(date));
};
export default function DashboardPage() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const settings = user?.settings || getSettings();
  const memberSince = user?.createdAt ? formatDate(user.createdAt, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'N/A';
  const profileCompletion = Math.min(100, Math.round([user?.name, user?.email].filter(Boolean).length / 2 * 100));
  const lastLogin = user?.lastLogin ? formatDate(user.lastLogin, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }) : 'Just now';
  const activityData = [{
    month: 'Jan',
    logins: 4,
    updates: 2
  }, {
    month: 'Feb',
    logins: 3,
    updates: 2
  }, {
    month: 'Mar',
    logins: 5,
    updates: 3
  }, {
    month: 'Apr',
    logins: 4,
    updates: 1
  }, {
    month: 'May',
    logins: 6,
    updates: 2
  }, {
    month: 'Jun',
    logins: 3,
    updates: 2
  }];
  const quickActions = [{
    icon: <User className="h-5 w-5" />,
    label: 'View Profile',
    description: 'Full profile details',
    href: '/dashboard/profile'
  }, {
    icon: <Settings className="h-5 w-5" />,
    label: 'Settings',
    description: 'Manage preferences',
    href: '/dashboard/settings'
  }, {
    icon: <Bell className="h-5 w-5" />,
    label: 'Notifications',
    description: 'Notification center',
    href: '/dashboard/notifications'
  }];
  return <div className="space-y-8">
      {}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Welcome, {user?.name || 'User'}</h1>
          <p className="mt-2 text-slate-300">Manage your account and profile settings</p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Account is active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberSince}</div>
            <p className="text-xs text-muted-foreground">Join date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <p className="text-xs text-muted-foreground">Complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.role || 'User'}</div>
            <p className="text-xs text-muted-foreground">User role</p>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="grid gap-8 lg:grid-cols-3">
        {}
        <div className="lg:col-span-2 space-y-6">
          {}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Full Name</p>
                  <p className="text-base font-semibold">{user?.name || 'N/A'}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Email</p>
                  <p className="text-base font-semibold break-all">{user?.email || 'N/A'}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Last Login</p>
                  <p className="text-base font-semibold">{lastLogin}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">2FA Status</p>
                  <p className="text-base font-semibold">
                    {settings.twoFactorAuth ? <span className="text-green-600">Enabled</span> : <span className="text-amber-600">Disabled</span>}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={() => navigate('/dashboard/edit-profile')} className="flex-1">
                  Edit Profile
                </Button>
                <Button onClick={() => navigate('/dashboard/change-password')} variant="outline" className="flex-1">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>Your account activity for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="logins" fill="#3b82f6" name="Logins" />
                  <Bar dataKey="updates" fill="#10b981" name="Profile Updates" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {}
        <div className="space-y-6">
          {}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <CardTitle>{user?.name || 'User'}</CardTitle>
              <CardDescription className="break-all">{user?.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted p-3 text-center">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Profile Completion</p>
                <p className="text-2xl font-bold mt-2">{profileCompletion}%</p>
              </div>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map(action => <Link key={action.href} to={action.href} className="flex items-center gap-3 rounded-lg border p-3 transition hover:bg-muted">
                  {action.icon}
                  <div>
                    <p className="text-sm font-semibold">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Link>)}
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-sm">Password</span>
                <span className="text-xs font-semibold text-green-600">✓ Secure</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-sm">2-Factor Auth</span>
                <span className={`text-xs font-semibold ${settings.twoFactorAuth ? 'text-green-600' : 'text-amber-600'}`}>
                  {settings.twoFactorAuth ? '✓ On' : '○ Off'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Verified</span>
                <span className="text-xs font-semibold text-green-600">✓ Yes</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
