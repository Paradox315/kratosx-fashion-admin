import type { Router, LocationQueryRaw, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { usePermissionStore, useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import { Message } from '@arco-design/web-vue';
import appRoutes from '../routes';

let asyncFlag = false;
export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    async function crossroads() {
      const Permission = usePermission();
      if (!asyncFlag) {
        const asyncRoutes = [
          ...(permissionStore.getRoutes() as RouteRecordRaw[]),
        ];
        let exist = false;
        asyncRoutes.forEach((route) => {
          router.addRoute('root', route);
          // eslint-disable-next-line no-unused-expressions
          route.name !== 'notFound' && appRoutes.push(route);
        });
        router.getRoutes().forEach((route) => {
          if (route.path === to.path) {
            exist = true;
          }
        });
        if (!exist) {
          next({
            name: 'notFound',
          });
        } else {
          next({ ...to, replace: true });
        }
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
        await crossroads();
      } else if (to.name === 'networkError') {
        next();
        NProgress.done();
      } else {
        try {
          await userStore.info();
          await permissionStore.setRoutes(userStore.currentRole as string);
          await crossroads();
        } catch (error: any) {
          Message.error(error.message);
          next({
            name: 'networkError',
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
