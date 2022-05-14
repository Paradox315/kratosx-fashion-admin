import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/enums/cache_enum';

const modules = import.meta.glob('../views/**/*.vue');

const dynamicImport = (component: string) => {
  const keys = Object.keys(modules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../', '/');
    return k === component;
  });
  const matchKey = matchKeys[0];
  return modules[matchKey];
};

const isLogin = () => {
  return !!localStorage.getItem(ACCESS_TOKEN);
};

const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
};
const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN);
};
const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN, token);
};
const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN, token);
};
const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN);
};
const clearRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN);
};
export {
  isLogin,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAccessToken,
  clearRefreshToken,
  dynamicImport,
};
