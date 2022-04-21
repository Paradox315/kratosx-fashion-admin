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

export interface ListMenuReply {
  list?: Menu[];

  /** @format int64 */
  total?: number;
}

export interface ListRouterReply {
  list?: RouterGroup[];

  /** @format int64 */
  total?: number;
}

export interface Menu {
  id?: string;
  parent_id?: string;
  path?: string;
  name?: string;
  component?: string;
  meta?: MenuMeta;
  children?: Menu[];
  created_at?: string;
  updated_at?: string;
  actions?: MenuAction[];
}

export interface MenuAction {
  code?: string;
  name?: string;
}

export interface MenuMeta {
  roles?: string[];
  require_auth?: boolean;
  icon?: string;
  locale?: string;

  /** @format int64 */
  order?: number;
  hide_in_menu?: boolean;
  no_affix?: boolean;
  ignore_cache?: boolean;
}

export interface MenuReply {
  tree?: Menu[];
}

export interface MenuRequest {
  id?: string;
  parent_id?: string;
  path?: string;
  name?: string;
  component?: string;
  meta?: MenuMeta;
  actions?: MenuAction[];
}

export interface Router {
  path?: string;
  method?: string;
  name?: string;
  params?: string[];
}

export interface RouterGroup {
  path?: string;
  name?: string;
  method?: string;
  children?: Router[];
}

export interface RouterReply {
  routers?: RouterGroup[];
  role_routers?: Router[];
}
