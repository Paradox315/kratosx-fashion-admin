import axios from 'axios';
import { HttpResponse } from '@/types/response';
import {
  CaptchaReply,
  LoginRequest,
  LoginReply,
  RegisterRequest,
  RegisterReply,
  UploadReply,
} from '@/types/public';

const prefix = '/api/system/v1/pub';

export function getCaptcha() {
  return axios.get<CaptchaReply, HttpResponse<CaptchaReply>>(
    `${prefix}/captcha`
  );
}

export function userRegister(data: RegisterRequest) {
  return axios.post<RegisterReply, HttpResponse<RegisterReply>>(
    `${prefix}/register`,
    data
  );
}

export function userLogin(data: LoginRequest) {
  return axios.post<LoginReply, HttpResponse<LoginReply>>(
    `${prefix}/login`,
    data
  );
}

export function userLogout() {
  return axios.post<void, HttpResponse<void>>(`${prefix}/logout`);
}

export function uploadFile(
  data: FormData,
  onUploadProgress?: (progressEvent: any) => void
) {
  return axios.post<UploadReply, HttpResponse<UploadReply>>(
    `${prefix}/upload`,
    data,
    {
      onUploadProgress,
    }
  );
}
