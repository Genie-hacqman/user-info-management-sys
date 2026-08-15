import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import userService from '../services/userService';
const AuthContext = createContext(null);
const normalizeUser = user => ({
  id: user?.id ?? user?._id ?? null,
  fullName: user?.fullName || user?.name || 'User',
  name: user?.name || user?.fullName || 'User',
  email: user?.email || '',
  phone: user?.phone || '',
  role: user?.role || 'user',
  status: user?.status || 'Active',
  avatar: user?.avatar || '',
  createdAt: user?.createdAt || new Date().toISOString(),
  ...user
});
const notifyUserDataChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sly-user-data-updated'));
  }
};
export function AuthProvider({
  children
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    setAuthReady(true);
  }, []);
  useEffect(() => {
    if (!authReady) return;
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const loadCurrentUser = async () => {
      try {
        setLoading(true);
        const {
          data
        } = await userService.getCurrentUser();
        setUser(normalizeUser(data));
      } catch (error) {
        console.error('Failed to hydrate current user from backend:', error);
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadCurrentUser();
  }, [authReady]);
  const login = userData => {
    const nextUser = normalizeUser(userData);
    notifyUserDataChanged();
    setUser(nextUser);
    return nextUser;
  };
  const register = userData => {
    const nextUser = normalizeUser({
      ...userData,
      role: userData.role || 'user',
      status: userData.status || 'Active'
    });
    notifyUserDataChanged();
    setUser(nextUser);
    return nextUser;
  };
  const logout = () => {
    localStorage.removeItem('authToken');
    notifyUserDataChanged();
    setUser(null);
  };
  const value = useMemo(() => ({
    user,
    loading,
    setLoading,
    isAuthenticated: Boolean(user),
    isAdmin: String(user?.role || '').toLowerCase() === 'admin',
    login,
    register,
    logout,
    setUser: nextUser => setUser(normalizeUser(nextUser))
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
export default AuthContext;
