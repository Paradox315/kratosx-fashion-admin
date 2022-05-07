import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { usePermissionStore, useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import appRoutes from '../routes';

let asyncFlag = false;
// TODO 先暂时这样写,存在不刷新时路由重复问题
export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    async function crossroads() {
      const Permission = usePermission();
      if (!asyncFlag) {
        const asyncRoutes = [...permissionStore.getRoutes()];
        asyncRoutes.forEach((route) => {
          router.addRoute('root', route);
          // eslint-disable-next-line no-unused-expressions
          route.name !== 'notFound' && appRoutes.push(route);
        });
        next({ ...to, replace: true });
        asyncFlag = true;
      } else if (Permission.accessRouter(to)) next();
      else {
        const destination = Permission.findFirstPermissionRoute(
          appRoutes,
          userStore.currentRole as string
        ) || {
          name: 'notFound',
        };
        next(destination);
      }

      NProgress.done();
    }
    if (isLogin()) {
      if (userStore.currentRole) {
        crossroads();
      } else {
        try {
          await userStore.info();
          await permissionStore.setRoutes(userStore.currentRole as string);
          crossroads();
        } catch (error) {
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
          NProgress.done();
        }
      }
    } else {
      if (to.name === 'login') {
        next();
        NProgress.done();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
      NProgress.done();
    }
  });
}
