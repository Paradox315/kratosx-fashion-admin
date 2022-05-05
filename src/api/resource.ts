import {
  IDReply,
  ListMenuActionReply,
  ListMenuReply,
  ListRouterReply,
  MenuReply,
  MenuRequest,
  RouterReply,
} from '@/api/model/resource';
import axios from 'axios';
import { HttpResponse } from '@/types/response';
import { Pagination } from '@/types/global';
import service from '@/utils/service';

const prefix = '/api/system/v1/resource';

export function createMenu(data: MenuRequest) {
  return service.post<IDReply>(`${prefix}/menu`, data);
}

export function updateMenu(data: MenuRequest) {
  return service.put(`${prefix}/menu`, data);
}

export function deleteMenu(ids: string) {
  return service.delete(`${prefix}/menu/${ids}`);
}

export function getMenuTree() {
  return service.get<MenuReply>(`${prefix}/menu`);
}

export function getMenuTreeByRole(roleId: string) {
  return service.get<MenuReply>(`${prefix}/menu/role/${roleId}`);
}
// TODO 刷新缓存
export function getMenuList(params: Pagination, refresh?: boolean) {
  return service.get<ListMenuReply>(
    `${prefix}/menu/list/${params.current}/${params.pageSize}`
  );
}

export function getRouterTree() {
  return service.get<RouterReply>(`${prefix}/router`);
}

export function getRouterTreeByRole(roleId: string) {
  return service.get<RouterReply>(`${prefix}/router/role/${roleId}`);
}

export function getRouterList(params: Pagination) {
  return service.get<ListRouterReply>(
    `${prefix}/router/list/${params.current}/${params.pageSize}`
  );
}

export function getActionByRole(roleId: string) {
  return service.get<ListMenuActionReply>(`${prefix}/action/role/${roleId}`);
}
