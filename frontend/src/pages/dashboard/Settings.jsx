import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
const defaultSettings = {
  emailNotifications: true,
  pushNotifications: true,
  weeklySummary: false,
  twoFactorAuth: false,
  profileVisibility: 'private',
  timezone: 'UTC',
  language: 'English',
  theme: 'light'
};
const STORAGE_KEY = 'sly-user-settings';
const localeMap = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  Arabic: 'ar-EG'
};
const applySettingsToApp = nextSettings => {
  const language = localeMap[nextSettings.language] || 'en-US';
  const theme = nextSettings.theme || 'light';
  document.documentElement.lang = language;
  document.documentElement.dataset.theme = theme;
  document.body.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
};
export default function SettingsPage() {
  const {
    user,
    setUser
  } = useAuth();
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const loadedSettings = saved ? {
        ...defaultSettings,
        ...JSON.parse(saved)
      } : defaultSettings;
      applySettingsToApp(loadedSettings);
      return loadedSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [status, setStatus] = useState({
    type: '',
    message: ''
  });
  useEffect(() => {
    applySettingsToApp(settings);
  }, [settings]);
  const updateSetting = (key, value) => {
    const nextSettings = {
      ...settings,
      [key]: value
    };
    setSettings(nextSettings);
    applySettingsToApp(nextSettings);
  };
  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      applySettingsToApp(settings);
      window.dispatchEvent(new Event('settings-updated'));
      if (user) {
        setUser({
          ...user,
          settings
        });
      }
      setStatus({
        type: 'success',
        message: 'Account settings saved successfully.'
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      setStatus({
        type: 'error',
        message: 'Unable to save settings right now.'
      });
    }
  };
  const handleReset = () => {
    const resetSettings = defaultSettings;
    setSettings(resetSettings);
    localStorage.removeItem(STORAGE_KEY);
    applySettingsToApp(resetSettings);
    window.dispatchEvent(new Event('settings-updated'));
    setStatus({
      type: 'success',
      message: 'Settings reset to default values.'
    });
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="mt-2 text-slate-600">Manage your preferences and security controls.</p>
      </div>

      {status.message && <div className={`rounded-lg border p-4 text-sm ${status.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {status.message}
        </div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Preferences</h2>
            <p className="text-sm text-slate-500">Customize how your account works.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="font-medium text-slate-800">Email notifications</p>
                <p className="text-sm text-slate-500">Receive important account updates by email.</p>
              </div>
              <input type="checkbox" checked={settings.emailNotifications} onChange={e => updateSetting('emailNotifications', e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="font-medium text-slate-800">Push notifications</p>
                <p className="text-sm text-slate-500">Get alerts on your active devices.</p>
              </div>
              <input type="checkbox" checked={settings.pushNotifications} onChange={e => updateSetting('pushNotifications', e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="font-medium text-slate-800">Weekly summary</p>
                <p className="text-sm text-slate-500">Receive a weekly account digest.</p>
              </div>
              <input type="checkbox" checked={settings.weeklySummary} onChange={e => updateSetting('weeklySummary', e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            </label>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Profile visibility</label>
              <select value={settings.profileVisibility} onChange={e => updateSetting('profileVisibility', e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <option value="private">Private</option>
                <option value="team">Team only</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Timezone</label>
              <select value={settings.timezone} onChange={e => updateSetting('timezone', e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Language</label>
              <select value={settings.language} onChange={e => updateSetting('language', e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Theme</label>
              <select value={settings.theme} onChange={e => updateSetting('theme', e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System default</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <Button type="button" variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button type="button" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save settings
          </Button>
        </div>
      </div>
    </div>;
}
