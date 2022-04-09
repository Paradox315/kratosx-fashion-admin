import axios from 'axios';
import { UserState } from '@/store/modules/user/types';
import { HttpResponse } from '@/types/response';
import {
  IDReply,
  ListSearchRequest,
  PasswordRequest,
  StatusRequest,
  UserReply,
  UserRequest,
} from '@/types/user';

const prefix = '/api/system/v1/user';

export function getUserInfo(id: string) {
  return axios.get<UserReply, HttpResponse<UserReply>>(`${prefix}/${id}`);
}

export function getUserList(params: ListSearchRequest) {
  return axios.post<UserReply[], HttpResponse<UserReply[]>>(`${prefix}/list`, {
    params,
  });
}

export function createUser(data: UserRequest) {
  return axios.post<IDReply, HttpResponse<IDReply>>(`${prefix}/`, {
    data,
  });
}

export function updateUser(id: string, data: UserRequest) {
  return axios.put<IDReply, HttpResponse<IDReply>>(`${prefix}/`, {
    data,
  });
}

export function deleteUser(ids: string) {
  return axios.delete<IDReply, HttpResponse<IDReply>>(`${prefix}/${ids}`);
}

export function updatePassword(data: PasswordRequest) {
  return axios.put<IDReply, HttpResponse<IDReply>>(`${prefix}/password`, {
    data,
  });
}

export function updateStatus(params: StatusRequest) {
  return axios.put<object, HttpResponse<object>>(`${prefix}/status`, {
    params,
  });
}
