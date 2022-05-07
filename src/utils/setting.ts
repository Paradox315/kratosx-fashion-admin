import defaultSettings from '@/config/settings.json';
import { AppState } from '@/store/modules/app/types';

const getSetting = (): AppState => {
  const setting = localStorage.getItem('app');
  return setting ? JSON.parse(setting) : defaultSettings;
};

const setSetting = (setting: AppState) => {
  setting.globalSettings = false;
  localStorage.setItem('app', JSON.stringify(setting));
};
export { getSetting, setSetting };
