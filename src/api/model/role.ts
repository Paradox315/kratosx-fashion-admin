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

export interface IDReply {
  /** @format uint64 */
  id?: string;
}

export interface ListRoleReply {
  list?: RoleReply[];

  /** @format int64 */
  total?: number;
}

export interface RoleReply {
  /** @format uint64 */
  id?: string;
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleRequest {
  /** @format uint64 */
  id?: string | number;
  name?: string;
  description?: string;
  resources?: RoleResource[];
  routers?: Router[];
}

export interface RoleResource {
  resourceId?: string;

  /** @format int64 */
  resourceType?: number;
}

export interface Router {
  path?: string;
  method?: string;
  name?: string;
  params?: string[];
}
