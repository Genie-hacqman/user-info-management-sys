import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Secure User Management',
    siteEmail: 'admin@example.com',
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireCapitalLetters: true,
    requireNumbers: true,
    requireSpecialChars: true,
    dataBackupFrequency: 'daily',
    apiRateLimit: 1000
  });
  const [saved, setSaved] = useState(false);
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setSaved(false);
  };
  const handleSaveSettings = () => {
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };
  const ToggleSwitch = ({
    checked,
    onChange
  }) => <button onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>;
  return <div className="space-y-8">
      {}
      <div>
        <h1 className="text-4xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-slate-300">Manage system-wide configuration and preferences</p>
      </div>

      {}
      {saved && <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 p-4">
          <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center text-white text-sm">✓</div>
          <p className="text-sm font-medium text-green-700">Settings saved successfully!</p>
        </div>}

      {}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic site configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Site Name</label>
            <Input value={settings.siteName} onChange={e => handleSettingChange('siteName', e.target.value)} placeholder="Enter site name" />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Admin Email</label>
            <Input type="email" value={settings.siteEmail} onChange={e => handleSettingChange('siteEmail', e.target.value)} placeholder="admin@example.com" />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground mt-1">Temporarily disable access for non-admin users</p>
            </div>
            <ToggleSwitch checked={settings.maintenanceMode} onChange={value => handleSettingChange('maintenanceMode', value)} />
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Authentication & Security</CardTitle>
          <CardDescription>User authentication and session settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Allow User Registration</p>
              <p className="text-xs text-muted-foreground mt-1">Let new users sign up for accounts</p>
            </div>
            <ToggleSwitch checked={settings.userRegistration} onChange={value => handleSettingChange('userRegistration', value)} />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground mt-1">Require 2FA for all users</p>
            </div>
            <ToggleSwitch checked={settings.twoFactorAuth} onChange={value => handleSettingChange('twoFactorAuth', value)} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Session Timeout (minutes)</label>
            <Input type="number" value={settings.sessionTimeout} onChange={e => handleSettingChange('sessionTimeout', parseInt(e.target.value) || 0)} min="1" />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Max Login Attempts</label>
            <Input type="number" value={settings.maxLoginAttempts} onChange={e => handleSettingChange('maxLoginAttempts', parseInt(e.target.value) || 0)} min="1" />
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Password Policy</CardTitle>
          <CardDescription>Configure password requirements for users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Minimum Password Length</label>
            <Input type="number" value={settings.passwordMinLength} onChange={e => handleSettingChange('passwordMinLength', parseInt(e.target.value) || 0)} min="4" max="50" />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Require Capital Letters</p>
            <ToggleSwitch checked={settings.requireCapitalLetters} onChange={value => handleSettingChange('requireCapitalLetters', value)} />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Require Numbers</p>
            <ToggleSwitch checked={settings.requireNumbers} onChange={value => handleSettingChange('requireNumbers', value)} />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Require Special Characters</p>
            <ToggleSwitch checked={settings.requireSpecialChars} onChange={value => handleSettingChange('requireSpecialChars', value)} />
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Email & Notifications</CardTitle>
          <CardDescription>Configure email and notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground mt-1">Send email alerts for important events</p>
            </div>
            <ToggleSwitch checked={settings.emailNotifications} onChange={value => handleSettingChange('emailNotifications', value)} />
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Data & API</CardTitle>
          <CardDescription>Backup and API rate limiting settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Backup Frequency</label>
            <select value={settings.dataBackupFrequency} onChange={e => handleSettingChange('dataBackupFrequency', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">API Rate Limit (requests/hour)</label>
            <Input type="number" value={settings.apiRateLimit} onChange={e => handleSettingChange('apiRateLimit', parseInt(e.target.value) || 0)} min="100" />
          </div>
        </CardContent>
      </Card>

      {}
      <div className="flex gap-3 justify-end">
        <Button variant="outline">Reset to Default</Button>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>;
}
