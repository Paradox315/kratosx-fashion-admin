import {
  IDReply,
  ListSearchRequest,
  ListUserLogReply,
  ListUserReply,
  PasswordRequest,
  UserReply,
  UserRequest,
  UserState,
} from '@/api/model/user';
import { Pagination } from '@/types/global';
import service from '@/utils/service';

const prefix = '/api/system/v1/user';

export function getUserInfo(id: string) {
  return service.get<UserReply>(`${prefix}/${id}`);
}

export function initUserInfo() {
  return service.get<UserState>(`${prefix}/init/info`);
}

export function getUserList(params: ListSearchRequest) {
  return service.post<ListUserReply>(`${prefix}/list`, params);
}

export function createUser(data: UserRequest) {
  return service.post<IDReply>(`${prefix}/`, data);
}

export function updateUser(data: UserRequest) {
  return service.put(`${prefix}/`, data);
}

export function deleteUser(ids: string) {
  return service.delete(`${prefix}/${ids}`);
}

export function updatePassword(data: PasswordRequest) {
  return service.put(`${prefix}/password`, data);
}

export function resetPassword(id: string) {
  return service.put(`${prefix}/reset-password/${id}`);
}

export function getLogList(params: Pagination) {
  return service.get<ListUserLogReply>(
    `${prefix}/log/list/${params.current}/${params.pageSize}`
  );
}
