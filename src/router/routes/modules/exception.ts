export default {
  path: 'exception',
  name: 'exception',
  component: () => import('@/views/exception/index.vue'),
  meta: {
    locale: 'menu.exception',
    requiresAuth: false,
    icon: 'icon-exclamation-circle',
    order: 6,
    hideInMenu: true,
    noAffix: true,
  },
  children: [
    {
      path: '403',
      name: '403',
      component: () => import('@/views/exception/403/index.vue'),
      meta: {
        locale: 'menu.exception.403',
        requiresAuth: false,
        hideInMenu: true,
        noAffix: true,
      },
    },
    {
      path: '404',
      name: '404',
      component: () => import('@/views/exception/404/index.vue'),
      meta: {
        locale: 'menu.exception.404',
        requiresAuth: false,
        hideInMenu: true,
        noAffix: true,
      },
    },
    {
      path: '500',
      name: '500',
      component: () => import('@/views/exception/500/index.vue'),
      meta: {
        locale: 'menu.exception.500',
        requiresAuth: false,
        hideInMenu: true,
        noAffix: true,
      },
    },
  ],
};
