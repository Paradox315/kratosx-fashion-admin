import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import usePermissionStore from './modules/permission';

const pinia = createPinia();
pinia.use(piniaPersist);

export { useAppStore, useUserStore, useTabBarStore, usePermissionStore };
export default pinia;
