import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import userService from '@/services/userService';
import { Activity, AlertCircle, CheckCircle, LogIn, UserPlus } from 'lucide-react';
export default function SystemActivityPage() {
  const [refreshTick, setRefreshTick] = useState(0);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userService.getAllUsers();
        const userData = Array.isArray(response) ? response : response.data || [];
        setUsers(userData);
      } catch (error) {
        console.error('Failed to load activity users:', error);
        setUsers([]);
      }
    };
    const handleChange = () => {
      setRefreshTick(value => value + 1);
      loadUsers();
    };
    loadUsers();
    window.addEventListener('sly-user-data-updated', handleChange);
    return () => window.removeEventListener('sly-user-data-updated', handleChange);
  }, [refreshTick]);
  const activityLog = useMemo(() => {
    const events = [];
    users.forEach(user => {
      const name = user.name || 'User';
      const email = user.email || 'unknown@example.com';
      if (user.registeredAt) {
        events.push({
          type: 'User Registration',
          user: name,
          email,
          time: user.registeredAt,
          icon: UserPlus,
          severity: 'info'
        });
      }
      if (user.lastLogin) {
        events.push({
          type: 'User Login',
          user: name,
          email,
          time: user.lastLogin,
          icon: LogIn,
          severity: 'success'
        });
      }
      if (user.status) {
        events.push({
          type: user.status === 'Active' ? 'User Account Activated' : 'Account Status Changed',
          user: name,
          email,
          time: user.updatedAt || user.lastLogin || user.createdAt || new Date().toISOString(),
          icon: user.status === 'Active' ? CheckCircle : AlertCircle,
          severity: user.status === 'Active' ? 'success' : 'warning'
        });
      }
    });
    return events.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 20).map(event => ({
      ...event,
      timeLabel: new Date(event.time).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    }));
  }, [users]);
  const activityStats = useMemo(() => {
    const total = activityLog.length;
    const logins = activityLog.filter(item => item.type === 'User Login').length;
    const warnings = activityLog.filter(item => item.severity === 'warning').length;
    const registrations = activityLog.filter(item => item.type === 'User Registration').length;
    return [{
      label: 'Total Activities',
      value: total,
      icon: Activity
    }, {
      label: 'Login Attempts',
      value: logins,
      icon: LogIn
    }, {
      label: 'Alerts',
      value: warnings,
      icon: AlertCircle
    }, {
      label: 'New Registrations',
      value: registrations,
      icon: UserPlus
    }];
  }, [activityLog]);
  return <div className="space-y-8">
      {}
      <div>
        <h1 className="text-4xl font-bold text-white">System Activity</h1>
        <p className="mt-2 text-slate-300">Real-time system activity and user events</p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activityStats.map((stat, idx) => {
        const Icon = stat.icon;
        return <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>;
      })}
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activities
          </CardTitle>
          <CardDescription>Latest {activityLog.length} system activities</CardDescription>
        </CardHeader>
        <CardContent>
          {activityLog.length === 0 ? <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No recent activity</p>
            </div> : <div className="space-y-4">
              {activityLog.map((activity, idx) => {
            const Icon = activity.icon;
            const severityConfig = {
              info: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                badge: 'secondary'
              },
              warning: {
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                badge: 'destructive'
              },
              alert: {
                bg: 'bg-red-50',
                border: 'border-red-200',
                badge: 'destructive'
              },
              success: {
                bg: 'bg-green-50',
                border: 'border-green-200',
                badge: 'default'
              }
            };
            const config = severityConfig[activity.severity];
            return <div key={`${activity.type}-${activity.email}-${idx}`} className={`rounded-lg border ${config.border} ${config.bg} p-4`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Icon className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{activity.type}</p>
                          <p className="text-sm text-muted-foreground mt-1">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.email}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={config.badge} className="capitalize">
                          {activity.severity}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">{activity.timeLabel}</p>
                      </div>
                    </div>
                  </div>;
          })}
            </div>}
        </CardContent>
      </Card>
    </div>;
}
