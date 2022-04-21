import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { clearToken, getToken, setToken } from '@/utils/auth';
import { HttpResponse } from '@/types/response';
import router from '@/router';

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}
axios.defaults.validateStatus = () => true;
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
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
      clearToken();
      setToken(newToken);
      window.location.reload();
    }
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message.error({
        content: res.message || 'Error',
        duration: 5 * 1000,
      });
      if (res.code === 401) {
        Modal.error({
          title: '认证鉴权失败',
          content: '您没有权限访问当前资源或者登录已过期，请重新登录',
          okText: '重新登录',
          async onOk() {
            const userStore = useUserStore();
            if (res?.reason === 'JWT_AUTH_ERROR') {
              clearToken();
            } else {
              await userStore.logout();
            }
            router.push('/login');
            window.location.reload();
          },
        });
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
