import { defineStore } from 'pinia';
import { userLogin, userLogout } from '@/api/public';
import { removeRouteListener } from '@/utils/route-listener';
import { initUserInfo, updateUser } from '@/api/user';
import { LoginRequest } from '@/api/model/public';
import { UserRequest, UserState } from '@/api/model/user';
import {
  clearAccessToken,
  clearRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/utils/auth';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    /** @format uint64 */
    id: undefined,
    username: undefined,
    email: undefined,
    mobile: undefined,
    avatar: undefined,
    nickname: undefined,
    gender: undefined,
    creator: undefined,
    address: '未知',
    country: '中国',
    city: '上海',
    description: '这里是描述',
    status: true,
    birthday: undefined,

    /** @format int64 */
    age: 0,
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
        setAccessToken(res.metadata.accessToken);
        setRefreshToken(res.metadata.refreshToken);
      } catch (err) {
        clearAccessToken();
        clearRefreshToken();
        throw err;
      }
    },

    // Logout
    async logout() {
      await userLogout();

      this.resetInfo();
      clearRefreshToken();
      clearAccessToken();
      removeRouteListener();
    },

    // update
    async update(req: UserRequest) {
      req.id = this.userInfo.id;
      await updateUser(req);
      await this.info();
    },
  },
});

export default useUserStore;
