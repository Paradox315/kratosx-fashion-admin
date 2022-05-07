import {
  CaptchaReply,
  LoginReply,
  LoginRequest,
  RefreshReply,
  RefreshRequest,
  RegisterRequest,
  UploadReply,
} from '@/api/model/public';
import service from '@/utils/service';

const prefix = '/api/system/v1/pub';

export function getCaptcha() {
  return service.get<CaptchaReply>(`${prefix}/captcha`);
}

export function userRegister(data: RegisterRequest) {
  return service.post(`${prefix}/register`, data);
}

export function refreshToken(data: RefreshRequest) {
  return service.post<RefreshReply>(`${prefix}/refresh-token`, data);
}

export function userLogin(data: LoginRequest) {
  return service.post<LoginReply>(`${prefix}/login`, data);
}

export function userLogout() {
  return service.put(`${prefix}/logout`);
}

export function uploadFile(
  data: FormData,
  onUploadProgress?: (progressEvent: any) => void
) {
  return service.post<UploadReply>(`${prefix}/upload`, data, {
    onUploadProgress,
  });
}
