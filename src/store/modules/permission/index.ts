import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { getMenuTreeByRole } from '@/api/resource';
import { dynamicImport } from '@/utils/auth';
import { Menu } from '@/api/model/resource';

interface AsyncRoute {
  routes: Menu[];
}

const buildAsyncRouter = (menus?: Menu[]) => {
  const buildChildTree = (menu: Menu): RouteRecordRaw => {
    return {
      path: menu.path,
      name: menu.name,
      component: dynamicImport(menu.component),
      meta: {
        roles: menu.meta?.roles,
        requiresAuth: menu.meta?.requireAuth as boolean,
        icon: menu.meta?.icon,
        locale: menu.meta?.locale,
        hideInMenu: menu.meta?.hideInMenu as boolean,
        order: menu.meta?.order,
        noAffix: menu.meta?.noAffix as boolean,
        ignoreCache: menu.meta?.ignoreCache as boolean,
      },
      children: menu.children?.map((child) => buildChildTree(child)),
    };
  };
  return menus?.map((menu: Menu) => buildChildTree(menu));
};

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
      this.routes = roleMenus as Menu[];
    },
    getRoutes() {
      return buildAsyncRouter(this.routes);
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
