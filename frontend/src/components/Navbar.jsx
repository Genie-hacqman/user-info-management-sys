import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Menu, X, LogOut, Settings, User } from 'lucide-react';
const getNotificationCount = () => {
  try {
    const saved = localStorage.getItem('sly-user-notifications');
    const notifications = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(notifications)) return 0;
    return notifications.filter(item => !item.read).length;
  } catch {
    return 0;
  }
};
export default function Navbar() {
  const {
    isAuthenticated,
    user,
    logout
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(getNotificationCount);
  useEffect(() => {
    const syncNotifications = () => setNotificationCount(getNotificationCount());
    syncNotifications();
    window.addEventListener('notifications-updated', syncNotifications);
    window.addEventListener('storage', event => {
      if (event.key === 'sly-user-notifications') {
        syncNotifications();
      }
    });
    return () => {
      window.removeEventListener('notifications-updated', syncNotifications);
    };
  }, []);
  const navItems = [{
    to: '/',
    label: 'Home'
  }, {
    to: '/dashboard',
    label: 'Dashboard',
    authOnly: true
  }, {
    to: '/admin',
    label: 'Admin',
    authOnly: true,
    adminOnly: true
  }];
  const visibleItems = navItems.filter(item => {
    const normalizedRole = String(user?.role || '').toLowerCase();
    if (!isAuthenticated && item.authOnly) return false;
    if (item.adminOnly && normalizedRole !== 'admin') return false;
    return true;
  });
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };
  return <header className="border-b bg-background sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {}
        <Link to="/" className="flex items-center gap-3 rounded-lg px-2 py-1 font-bold text-lg transition hover:opacity-80">
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="hidden sm:inline">SLY</span>
        </Link>

        {}
        <nav className="hidden md:flex items-center gap-1">
          {visibleItems.map(item => <NavLink key={item.to} to={item.to} className={({
          isActive
        }) => `px-3 py-2 text-sm font-medium rounded-md transition ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              {item.label}
            </NavLink>)}
        </nav>

        {}
        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated ? <>
              {}
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/dashboard/notifications" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-white">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>}
                </Link>
              </Button>

              {}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-sm">{user?.name || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile" className="cursor-pointer gap-2">
                      <User className="h-4 w-4" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="cursor-pointer gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </> : <Button asChild>
              <Link to="/">Login</Link>
            </Button>}

          {}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {}
      {mobileMenuOpen && <nav className="border-t bg-muted/50 md:hidden">
          <div className="px-4 py-3 space-y-2">
            {visibleItems.map(item => <NavLink key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className={({
          isActive
        }) => `block px-3 py-2 rounded-md text-sm font-medium transition ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                {item.label}
              </NavLink>)}
            {isAuthenticated && <>
                <div className="my-2 border-t" />
                <Link to="/dashboard/notifications" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </span>
                  {notificationCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-white">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>}
                </Link>
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>}
          </div>
        </nav>}
    </header>;
}
