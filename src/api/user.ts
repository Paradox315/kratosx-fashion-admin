import axios from 'axios';
import { HttpResponse } from '@/types/response';
import {
  IDReply,
  ListLoginLogReply,
  ListSearchRequest,
  ListUserReply,
  PasswordRequest,
  StatusRequest,
  UserReply,
  UserRequest,
} from '@/types/user';
import { UserState } from '@/store/modules/user/types';

const prefix = '/api/system/v1/user';

export function getUserInfo(id: string) {
  return axios.get<UserReply, HttpResponse<UserReply>>(`${prefix}/${id}`);
}

export function initUserInfo() {
  return axios.get<UserState, HttpResponse<UserState>>(`${prefix}/init/info`);
}

export function getUserList(params: ListSearchRequest) {
  return axios.post<ListUserReply, HttpResponse<ListUserReply>>(
    `${prefix}/list`,
    params
  );
}

export function createUser(data: UserRequest) {
  return axios.post<IDReply, HttpResponse<IDReply>>(`${prefix}/`, data);
}

export function updateUser(data: UserRequest) {
  return axios.put<IDReply, HttpResponse<IDReply>>(`${prefix}/`, data);
}

export function deleteUser(ids: string) {
  return axios.delete<IDReply, HttpResponse<IDReply>>(`${prefix}/${ids}`);
}

export function updatePassword(data: PasswordRequest) {
  return axios.put<IDReply, HttpResponse<IDReply>>(`${prefix}/password`, data);
}

export function updateStatus(params: StatusRequest) {
  return axios.put<object, HttpResponse<object>>(`${prefix}/status`, params);
}

export function getLogList(pageNum: number, pageSize: number) {
  return axios.get<ListLoginLogReply, HttpResponse<ListLoginLogReply>>(
    `${prefix}/log/list`,
    {
      params: {
        pageNum,
        pageSize,
      },
    }
  );
}
