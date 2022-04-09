export interface UserState {
  id?: string;
  username?: string;
  avatar?: string;
  email?: string;
  mobile?: string;
  nickname?: string;
  gender?: string;

  /** @format int64 */
  status?: number;
  registerDate?: string;
  roles: Array<string | undefined> | undefined;
}
