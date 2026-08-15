import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import './App.css';
const localeMap = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  Arabic: 'ar-EG'
};
const getSavedSettings = () => {
  try {
    const saved = localStorage.getItem('sly-user-settings');
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Unable to read saved app preferences:', error);
    return {};
  }
};
function applyAppPreferences() {
  const settings = getSavedSettings();
  const language = localeMap[settings.language] || 'en-US';
  const theme = settings.theme || 'light';
  document.documentElement.lang = language;
  document.documentElement.dataset.theme = theme;
  document.body.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
  document.body.classList.toggle('theme-dark', theme === 'dark');
  document.body.classList.toggle('theme-light', theme !== 'dark');
}
function App() {
  useEffect(() => {
    applyAppPreferences();
    const handleSettingsUpdate = () => applyAppPreferences();
    const handleStorage = event => {
      if (event.key === 'sly-user-settings') {
        handleSettingsUpdate();
      }
    };
    window.addEventListener('settings-updated', handleSettingsUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
  return <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>;
}
export default App;
