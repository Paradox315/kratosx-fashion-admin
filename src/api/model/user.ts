/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface QueryOptionInterval {
  from?: string;
  to?: string;
}

export interface IDReply {
  /** @format uint64 */
  id?: string;
}

export interface ListSearchRequest {
  /** @format int64 */
  current: number;

  /** @format int64 */
  pageSize: number;
  query?: QueryOption[];
}

export interface ListUserLogReply {
  list?: UserLog[];

  /** @format int64 */
  total?: number;
}

export interface ListUserReply {
  list?: UserReply[];

  /** @format int64 */
  total?: number;
}

export interface PasswordRequest {
  /** @format uint64 */
  id?: string | number;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  refreshToken?: string;
}

export interface Position {
  /** @format float */
  lat?: number;

  /** @format float */
  lng?: number;
}

export interface QueryOption {
  /** ["EQ", "NEQ", "GT", "GTE", "LT", "LTE", "IN", "SORT", "LIKE", "BETWEEN"] */
  opt?: string;

  /** 根据opt的不同，可能是string，int，bool，或者是一个数组 */
  value?: string;
  interval?: QueryOptionInterval;
  field?: string;
  desc?: boolean;
  time?: boolean;
}

export interface UserLog {
  /** @format uint64 */
  id?: string;
  ip?: string;
  method?: string;
  path?: string;

  /** @format int64 */
  status?: number;
  country?: string;
  region?: string;
  city?: string;
  position?: Position;
  time?: string;
  userAgent?: string;
  client?: string;
  os?: string;
  device?: string;
  deviceType?: string;
  Type?: string;
}

export interface UserReply {
  /** @format uint64 */
  id?: string;
  username?: string;
  email?: string;
  mobile?: string;
  avatar?: string;
  nickname?: string;
  gender?: string;
  creator?: string;
  address?: string;
  country?: string;
  city?: string;
  description?: string;
  status?: boolean;
  birthday?: string;

  /** @format int64 */
  age?: number;
  createdAt?: string;
  updatedAt?: string;
  roles?: UserRole[];
}

export interface UserRequest {
  /** @format uint64 */
  id?: string | number;
  username?: string;
  avatar?: string;
  email?: string;
  mobile?: string;
  nickname?: string;
  address?: string;
  country?: string;
  city?: string;
  description?: string;
  birthday?: string;

  /** @format int64 */
  gender?: number;

  /** @format int64 */
  age?: number;
  status?: boolean;
  roles?: string[];
}

export interface UserRole {
  /** @format uint64 */
  id?: string | number;
  name?: string;
}

export interface UserState {
  /** @format uint64 */
  id?: string | number;
  username?: string;
  email?: string;
  mobile?: string;
  avatar?: string;
  nickname?: string;
  gender?: string;
  creator?: string;
  address?: string;
  country?: string;
  city?: string;
  description?: string;
  status?: boolean;
  birthday?: string;

  /** @format int64 */
  age?: number;
  registerDate?: string;
  roles?: string[];
}
