import {
  IDReply,
  ListMenuReply,
  ListRouterReply,
  MenuReply,
  MenuRequest,
  RouterReply,
} from '@/types/resource';
import axios from 'axios';
import { HttpResponse } from '@/types/response';
import { Pagination } from '@/types/global';

const prefix = '/api/system/v1/resource';

export function createMenu(data: MenuRequest) {
  return axios.post<IDReply, HttpResponse<IDReply>>(`${prefix}/menu`, data);
}

export function updateMenu(data: MenuRequest) {
  return axios.put<IDReply, HttpResponse<IDReply>>(`${prefix}/menu`, data);
}

export function deleteMenu(ids: string) {
  return axios.delete<void, HttpResponse<void>>(`${prefix}/menu/${ids}`);
}

export function getMenuTree() {
  return axios.get<MenuReply, HttpResponse<MenuReply>>(`${prefix}/menu`);
}

export function getMenuTreeByRole(roleId: string) {
  return axios.get<MenuReply, HttpResponse<MenuReply>>(
    `${prefix}/menu/role/${roleId}`
  );
}

export function getMenuList(params: Pagination) {
  return axios.get<ListMenuReply, HttpResponse<ListMenuReply>>(
    `${prefix}/menu/list/${params.current}/${params.pageSize}`
  );
}

export function getRouterTree() {
  return axios.get<RouterReply, HttpResponse<RouterReply>>(`${prefix}/router`);
}

export function getRouterTreeByRole(roleId: string) {
  return axios.get<RouterReply, HttpResponse<RouterReply>>(
    `${prefix}/router/role/${roleId}`
  );
}

export function getRouterList(params: Pagination) {
  return axios.get<ListRouterReply, HttpResponse<ListRouterReply>>(
    `${prefix}/router/list/${params.current}/${params.pageSize}`
  );
}
