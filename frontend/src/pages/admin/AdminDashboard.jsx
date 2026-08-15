import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import userService from '@/services/userService';
import { Users, TrendingUp, Activity, AlertCircle, RefreshCw, LogIn } from 'lucide-react';
const getRegistrationOverview = users => {
  const summary = new Map();
  users.forEach(user => {
    const dateKey = user.registeredAt || new Date().toISOString().slice(0, 10);
    if (!summary.has(dateKey)) {
      summary.set(dateKey, {
        date: dateKey,
        total: 0,
        staff: 0
      });
    }
    const bucket = summary.get(dateKey);
    bucket.total += 1;
    if (['Admin', 'Manager', 'Support'].includes(user.role)) {
      bucket.staff += 1;
    }
  });
  return [...summary.values()].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7).map(item => ({
    ...item,
    label: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }));
};
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    inactiveUsers: 0,
    usersSignedIn: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    fetchStats();
  }, []);
  const fetchStats = async () => {
    try {
      const response = await userService.getAllUsers();
      const userData = Array.isArray(response) ? response : response.data || [];
      setUsers(userData);
      const active = userData.filter(u => u.status === 'Active').length;
      const inactive = userData.filter(u => u.status === 'Inactive').length;
      const newUsersCount = userData.filter(u => {
        const regDate = new Date(u.registeredAt || u.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return regDate > thirtyDaysAgo;
      }).length;
      const usersSignedIn = userData.filter(u => u.lastLogin).length;
      setStats({
        totalUsers: userData.length,
        activeUsers: active,
        newUsers: newUsersCount,
        inactiveUsers: inactive,
        usersSignedIn: usersSignedIn
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };
  const chartData = [{
    name: 'Jan',
    users: 400,
    active: 300
  }, {
    name: 'Feb',
    users: 500,
    active: 380
  }, {
    name: 'Mar',
    users: 600,
    active: 450
  }, {
    name: 'Apr',
    users: 700,
    active: 520
  }, {
    name: 'May',
    users: 750,
    active: 600
  }, {
    name: 'Jun',
    users: stats.totalUsers,
    active: stats.activeUsers
  }];
  const userDistribution = [{
    name: 'Active',
    value: stats.activeUsers
  }, {
    name: 'Inactive',
    value: stats.inactiveUsers
  }];
  const COLORS = ['#3b82f6', '#ef4444'];
  const overviewData = getRegistrationOverview(users);
  return <div className="space-y-8">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-2 text-slate-300">Welcome back! Here's what's happening with your users.</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newUsers} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers * 100).toFixed(0) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users Signed In</CardTitle>
            <LogIn className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usersSignedIn}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers > 0 ? (stats.usersSignedIn / stats.totalUsers * 100).toFixed(0) : 0}% have signed in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactiveUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers > 0 ? (stats.inactiveUsers / stats.totalUsers * 100).toFixed(0) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user activity trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Total Users" />
                <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} name="Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Active vs Inactive</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={userDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {userDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your system</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/admin/users')}>Manage Users</Button>
          <Button variant="outline" onClick={() => navigate('/admin/reports')}>View Reports</Button>
          <Button variant="outline" onClick={() => navigate('/admin/settings')}>System Settings</Button>
          <Button variant="outline" onClick={() => navigate('/admin/activity')}>View Activity</Button>
        </CardContent>
      </Card>
    </div>;
}
