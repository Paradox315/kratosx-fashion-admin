import { Pagination } from '@/types/global';
import {
  IDReply,
  ListRoleReply,
  RoleReply,
  RoleRequest,
} from '@/api/model/role';
import service from '@/utils/service';

const prefix = '/api/system/v1/role';

export function getRoleList(params: Pagination) {
  return service.get<ListRoleReply>(
    `${prefix}/list/${params.current}/${params.pageSize}`
  );
}

export function getRole(id: number) {
  return service.get<RoleReply>(`${prefix}/${id}`);
}

export function createRole(data: RoleRequest) {
  return service.post<IDReply>(`${prefix}/`, data);
}

export function updateRole(data: RoleRequest) {
  return service.put(`${prefix}/`, data);
}

export function deleteRole(id: string) {
  return service.delete(`${prefix}/${id}`);
}
