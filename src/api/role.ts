import { Pagination } from '@/types/global';
import axios from 'axios';
import {
  EmptyReply,
  IDReply,
  ListRoleReply,
  RoleReply,
  RoleRequest,
} from '@/types/role';
import { HttpResponse } from '@/types/response';

const prefix = '/api/system/v1/role';

export function getRoleList(params: Pagination) {
  return axios.get<ListRoleReply, HttpResponse<ListRoleReply>>(
    `${prefix}/list/${params.current}/${params.pageSize}`
  );
}

export function getRole(id: number) {
  return axios.get<RoleReply, HttpResponse<RoleReply>>(`${prefix}/${id}`);
}

export function createRole(data: RoleRequest) {
  return axios.post<IDReply, HttpResponse<IDReply>>(`${prefix}/`, data);
}

export function updateRole(data: RoleRequest) {
  return axios.put<IDReply, HttpResponse<IDReply>>(`${prefix}/`, data);
}

export function deleteRole(id: string) {
  return axios.delete<EmptyReply, HttpResponse<EmptyReply>>(`${prefix}/${id}`);
}
