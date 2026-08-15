import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User, Edit, Lock, LogOut, Settings, Bell, Home, Users, BarChart3, Shield, Activity } from 'lucide-react';
const userLinks = [{
  to: '/dashboard',
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  to: '/dashboard/profile',
  label: 'Profile',
  icon: User
}, {
  to: '/dashboard/edit-profile',
  label: 'Edit Profile',
  icon: Edit
}, {
  to: '/dashboard/change-password',
  label: 'Change Password',
  icon: Lock
}, {
  to: '/dashboard/settings',
  label: 'Settings',
  icon: Settings
}, {
  to: '/dashboard/notifications',
  label: 'Notifications',
  icon: Bell
}];
const adminLinks = [{
  to: '/admin',
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  to: '/admin/users',
  label: 'Users',
  icon: Users
}, {
  to: '/admin/reports',
  label: 'Reports',
  icon: BarChart3
}, {
  to: '/admin/activity',
  label: 'Activity',
  icon: Activity
}, {
  to: '/admin/settings',
  label: 'Settings',
  icon: Shield
}];
export default function Sidebar() {
  const {
    user,
    logout
  } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'Admin';
  const links = isAdmin ? adminLinks : userLinks;
  const isActive = linkPath => {
    if (linkPath === '/dashboard' || linkPath === '/admin') {
      return location.pathname === linkPath;
    }
    return location.pathname.startsWith(linkPath);
  };
  return <aside className="w-64 shrink-0 bg-card border-r flex flex-col h-screen">
      {}
      <div className="px-6 py-6 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <div>
            <h1 className="font-bold text-lg">SLY</h1>
            <p className="text-xs text-muted-foreground">{isAdmin ? 'Admin' : 'User'}</p>
          </div>
        </div>
      </div>

      {}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">{user?.role || 'user'}</p>
          </div>
        </div>
      </div>

      {}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map(item => {
        const Icon = item.icon;
        const active = isActive(item.to);
        return <NavLink key={item.to} to={item.to} className={({
          isActive: routeActive
        }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${routeActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>;
      })}
      </nav>

      {}
      <div className="p-4 border-t space-y-2">
        <Button onClick={logout} variant="outline" className="w-full gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>;
}
