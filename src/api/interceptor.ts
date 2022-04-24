import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { clearToken, getToken, setToken } from '@/utils/auth';
import { HttpResponse } from '@/types/response';
import router from '@/router';
import { useCookies } from 'vue3-cookies';
import axiosRetry from 'axios-retry';

const { cookies } = useCookies();

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}
axios.defaults.validateStatus = () => true;
axios.defaults.withCredentials = true;
axiosRetry(axios, { retries: 3 });
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    const csrf = cookies.get('csrf_');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (csrf) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['X-Csrf-Token'] = csrf;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const newToken = response.headers['new-token'];
    if (newToken) {
      setTimeout(() => {
        setToken(newToken);
      }, 1000);
      window.location.reload();
    }
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (response.status !== 200) {
      Message.error({
        content: res.message || response.statusText,
        duration: 5 * 1000,
      });
      if (response.status === 401) {
        if (res?.reason === 'JWT_AUTH_ERROR') {
          clearToken();
          router.push('/login');
        }
        Modal.error({
          title: '认证鉴权失败',
          content: '您没有权限访问当前资源或者登录已过期，请重新登录',
          okText: '重新登录',
          async onOk() {
            const userStore = useUserStore();
            await userStore.logout();
            router.push('/login');
            window.location.reload();
          },
        });
      }
      if (response.status === 403) {
        axios.get('/');
      }
      return Promise.reject(new Error(res.error || res.message || 'Error'));
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.message || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
