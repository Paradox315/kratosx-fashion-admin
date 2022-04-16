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

export interface ListRoleReply {
  list?: RoleReply[];

  /** @format int64 */
  total?: number;
}

export interface RoleReply {
  id?: string;
  name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  role_resources?: RoleResource[];
}

export interface RoleRequest {
  id?: string;
  name?: string;
  description?: string;
  role_resources?: RoleResource[];
  role_routers?: Router[];
}

export interface RoleResource {
  id?: string;
  role_id?: string;
  resource_id?: string;

  /** @format int64 */
  resource_type?: number;
}

export interface Router {
  path?: string;
  method?: string;
  name?: string;
  params?: string[];
}
