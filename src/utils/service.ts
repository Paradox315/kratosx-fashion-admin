import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpResponse } from '@/types/response';

const pendingRequest = new Map<string, any>();
const { CancelToken } = axios;
const source = CancelToken.source();

const generateReqKey = (config: AxiosRequestConfig) => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
};

const resGenerateReqKey = (config: AxiosRequestConfig) => {
  const { method, url, params, data } = config;
  return [method, url, params, data].join('&');
};

const addPendingRequest = (config: any) => {
  const requestKey = generateReqKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel: any) => {
      if (!pendingRequest.has(requestKey)) {
        pendingRequest.set(requestKey, cancel);
      }
    });
};
const removePendingRequest = (config: any) => {
  const requestKey = generateReqKey(config);
  if (pendingRequest.has(requestKey)) {
    config.cancelToken = source.token;
    source.cancel();
  }
};

const clearPending = () => {
  pendingRequest.forEach((cancel: any, requestKey: string) => {
    cancel(requestKey);
  });
  pendingRequest.clear();
};

class Request {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  get<T = any, R = HttpResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.instance.get(url, config);
  }

  delete<T = any, R = HttpResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.instance.delete(url, config);
  }

  options<T = any, R = HttpResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.instance.options(url, config);
  }

  post<T = any, R = HttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.instance.post(url, data, config);
  }

  put<T = any, R = HttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.instance.put(url, data, config);
  }

  patch<T = any, R = HttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.instance.patch(url, data, config);
  }
}
const service = new Request(axios);
export default service;
export {
  generateReqKey,
  resGenerateReqKey,
  addPendingRequest,
  removePendingRequest,
  clearPending,
  pendingRequest,
};
