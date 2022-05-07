import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import DefaultLayout from '@/layout/default-layout.vue';
import Login from './routes/modules/login';
import appRoutes from './routes';
import createRouteGuard from './guard';

NProgress.configure({ showSpinner: true }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard/workplace',
    },
    Login,
    {
      name: 'root',
      path: '/',
      component: DefaultLayout,
      children: appRoutes,
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
