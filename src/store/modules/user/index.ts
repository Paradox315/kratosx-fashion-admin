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
// TODO 持久化
const useUserStore = defineStore('user', {
  state: (): UserState => ({
    /** @format uint64 */
    id: undefined,
    username: undefined,
    email: undefined,
    mobile: undefined,
    avatar: undefined,
    nickname: undefined,
    gender: '未知',
    creator: 'admin',
    address: '未知',
    country: '中国',
    city: '上海',
    description: '这里是描述',
    status: true,
    birthday: undefined,

    /** @format int64 */
    age: 0,
    registerDate: undefined,
    roles: [],
    currentRole: undefined,
    figures: [],
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles(roleID: number | string) {
      this.currentRole = roleID;
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
      const { metadata: info } = await initUserInfo();
      this.setInfo(info);
    },

    // Login
    async login(loginForm: LoginRequest) {
      try {
        const { metadata } = await userLogin(loginForm);
        setAccessToken(metadata.accessToken);
        setRefreshToken(metadata.refreshToken);
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
  persist: {
    enabled: true,
  },
});

export default useUserStore;
