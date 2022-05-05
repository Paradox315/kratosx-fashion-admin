import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import {
  clearAccessToken,
  clearRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/utils/auth';
import { HttpResponse } from '@/types/response';
import router from '@/router';
import axiosRetry from 'axios-retry';
import { get } from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { RefreshRequest } from '@/api/model/public';
import { JWT_AUTH_ERROR } from '@/enums/error_enum';
import i18n from '@/locale';
import { useCookies } from 'vue3-cookies';
import { refreshToken } from '@/api/public';

const { cookies } = useCookies();
const { t } = i18n.global;

// resetSession
const resetSession = () => {
  clearRefreshToken();
  clearAccessToken();
  router.push('/login');
};

// showError 展示错误
const showError = (error: any, message: string) => {
  Message.error({
    content: message || error.message,
    duration: 5 * 1000,
  });
};

// errorHandler错误处理函数
const errorHandler = async (
  status: number,
  res: HttpResponse
): Promise<string> => {
  switch (status) {
    case StatusCodes.BAD_REQUEST:
      return t('http.status.BadRequest');
    case StatusCodes.UNAUTHORIZED:
      if (res?.reason === JWT_AUTH_ERROR) {
        const token = getRefreshToken();
        if (token && token.length > 0) {
          Message.info('自动续期中，请稍候...');
          try {
            const resp = await refreshToken({
              refreshToken: token,
            } as RefreshRequest);
            setAccessToken(resp.metadata.accessToken);
            setRefreshToken(resp.metadata.refreshToken);
            Message.success('续期成功');
            window.location.reload();
          } catch (e) {
            resetSession();
          }
        } else {
          resetSession();
        }
      } else {
        const userStore = useUserStore();
        await userStore.logout();
        resetSession();
      }
      return t('http.status.Unauthorized');
    case StatusCodes.FORBIDDEN:
      return t('http.status.Forbidden');
    case StatusCodes.NOT_FOUND:
      return t('http.status.NotFound');
    case StatusCodes.METHOD_NOT_ALLOWED:
      return t('http.status.MethodNotAllowed');
    case StatusCodes.INTERNAL_SERVER_ERROR:
      return t('http.status.InternalServerError');
    case StatusCodes.BAD_GATEWAY:
      return t('http.status.BadGateway');
    case StatusCodes.SERVICE_UNAVAILABLE:
      return t('http.status.ServiceUnavailable');
    case StatusCodes.GATEWAY_TIMEOUT:
      return t('http.status.Timeout');
    default:
      return t('http.status.Unknown');
  }
};
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}
// axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getAccessToken();
    const csrf = cookies.get('csrf_');
    if (!config.headers) {
      config.headers = {};
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (csrf) {
      config.headers['X-Csrf-Token'] = csrf;
    }
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => response.data,
  async (error) => {
    const status = get(error, 'response.status');
    const res = get(error, 'response.data');
    if (status) {
      showError(error, await errorHandler(status, res));
    }
    return Promise.reject(error);
  }
);
