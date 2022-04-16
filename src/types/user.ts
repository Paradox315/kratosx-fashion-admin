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

export interface ProtobufAny {
  '@type'?: string;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: ProtobufAny[];
}

export type EmptyReply = object;

export interface IDReply {
  id?: string;
}

export interface ListSearchRequest {
  /** @format int64 */
  page_num: number;

  /** @format int64 */
  page_size: number;
  query?: QueryOption[];
}

export interface ListUserReply {
  list?: UserReply[];

  /** @format int64 */
  total?: number;
}

export interface PasswordRequest {
  id?: string;
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
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

export interface StatusRequest {
  id?: string;

  /** @format int64 */
  status?: number;
}

export interface UserReply {
  id?: string;
  username?: string;
  avatar?: string;
  email?: string;
  mobile?: string;
  nickname?: string;
  gender?: string;

  /** @format int64 */
  status?: number;
  creator?: string;
  created_at?: string;
  updated_at?: string;
  roles?: UserRole[];
}

export interface UserRequest {
  id?: string;
  username?: string;
  password?: string;
  avatar?: string;
  email?: string;
  mobile?: string;
  nickname?: string;

  /** @format int64 */
  gender?: number;

  /** @format int64 */
  status?: number;
  roles?: string[];
}

export interface UserRole {
  id?: string;
  name?: string;
}

export interface Position {
  lat?: number;
  lng?: number;
}

export interface LoginLogReply {
  id?: string;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  position?: Position;
  time?: string;
  agent?: string;
  os?: string;
  device?: string;
  device_type?: number;
  login_type?: number;
}

export interface ListLoginLogReply {
  list?: LoginLogReply[];
  total?: number;
}
