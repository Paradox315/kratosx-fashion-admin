import { defineStore } from 'pinia';
import { userLogin, userLogout } from '@/api/public';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { initUserInfo } from '@/api/user';
import { LoginRequest } from '@/types/public';
import { UserState } from './types';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    username: undefined,
    avatar: undefined,
    email: undefined,
    mobile: undefined,
    nickname: undefined,
    gender: undefined,

    /** @format int64 */
    status: undefined,
    registerDate: undefined,
    roles: undefined,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        // this.role = this.role === 'user' ? 'admin' : 'user';
        // resolve(this.role);
      });
    },
    // Set user's information
    setInfo(info: Partial<UserState>) {
      this.$patch(info);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await initUserInfo();
      this.setInfo(res.metadata);
    },

    // Login
    async login(loginForm: LoginRequest) {
      try {
        const res = await userLogin(loginForm);
        setToken(<string>res.metadata.token?.access_token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // Logout
    async logout() {
      await userLogout();

      this.resetInfo();
      clearToken();
      removeRouteListener();
    },
  },
});

export default useUserStore;
