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
  "@type"?: string;
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
  pageNum?: number;

  /** @format int64 */
  page_size?: number;
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
  created_at?: string;
  updated_at?: string;
  user_roles?: UserRole[];
}

export interface UserRequest {
  id?: string;
  username?: string;
  password?: string;
  avatar?: string;
  email?: string;
  mobile?: string;

  /** @format int64 */
  gender?: number;

  /** @format int64 */
  status?: number;
  user_roles?: UserRoleID[];
}

export interface UserRole {
  id?: string;
  name?: string;
  description?: string;
}

export interface UserRoleID {
  id?: string;
  user_id?: string;
  role_id?: string;
}
