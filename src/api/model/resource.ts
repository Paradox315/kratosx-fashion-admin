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

export interface ListMenuActionReply {
  list?: string[];

  /** @format int64 */
  total?: number;
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
  /** @format uint64 */
  id?: string;

  /** @format uint64 */
  parentId?: string;
  path: string;
  name: string;
  component: string;
  description?: string;
  meta?: MenuMeta;
  children?: Menu[];
  actions?: MenuAction[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuAction {
  code?: string;
  name?: string;
}

export interface MenuMeta {
  roles?: string[];
  requireAuth: boolean;
  icon?: string;
  locale?: string;

  /** @format int64 */
  order?: number;
  hideInMenu?: boolean;
  noAffix?: boolean;
  ignoreCache?: boolean;
}

export interface MenuReply {
  list?: Menu[];
}

export interface MenuRequest {
  /** @format uint64 */
  id?: string | number;

  /** @format uint64 */
  parentId?: string | number;
  path?: string;
  name?: string;
  component?: string;
  description?: string;
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
  roleRouters?: Router[];
}
