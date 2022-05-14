import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import { clearPending } from '@/utils/service';
import setupPermissionGuard from './permission';

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    clearPending();
    // emit route change
    setRouteEmitter(to);
  });
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupPermissionGuard(router);
}
