import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { getMenuTreeByRole } from '@/api/resource';
import { dynamicImport } from '@/utils/auth';
import { Menu } from '@/api/model/resource';
import appRoutes from '@/router/routes';

interface AsyncRoute {
  routes: Menu[];
}

const buildAsyncRouter = (menus?: Menu[]): RouteRecordRaw[] => {
  const buildChildTree = (menu: Menu): RouteRecordRaw => {
    return {
      path: menu.path,
      name: menu.name,
      component: dynamicImport(menu.component),
      meta: {
        roles: menu?.meta?.roles,
        requiresAuth: menu?.meta?.requireAuth as boolean,
        icon: menu?.meta?.icon,
        locale: menu?.meta?.locale,
        hideInMenu: menu?.meta?.hideInMenu,
        order: menu?.meta?.order,
        noAffix: menu?.meta?.noAffix,
        ignoreCache: menu?.meta?.ignoreCache,
      },
      children: menu.children?.map((child) => buildChildTree(child)),
    };
  };
  return menus?.map((menu: Menu) => buildChildTree(menu)) as RouteRecordRaw[];
};
// TODO 持久化
const usePermissionStore = defineStore('permission', {
  state: (): AsyncRoute => {
    return {
      routes: [],
    };
  },
  actions: {
    async setRoutes(roleId: string | number) {
      const { metadata } = await getMenuTreeByRole(roleId as string);
      const roleMenus = metadata.list;
      roleMenus?.push({
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: '/views/not-found/index.vue',
      });
      this.routes = roleMenus as Menu[];
    },
    getRoutes() {
      return buildAsyncRouter(this.routes as Menu[]);
    },
    resetRoutes() {
      this.$reset();
    },
  },
  persist: {
    enabled: true,
  },
});

export default usePermissionStore;
