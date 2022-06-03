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

export interface DiskReply {
  path?: string;

  /** @format uint64 */
  total?: string;

  /** @format uint64 */
  free?: string;

  /** @format uint64 */
  used?: string;

  /** @format float */
  usedPercent?: number;
}

export interface RuntimeReply {
  host?: string;
  os?: string;
  arch?: string;
  platform?: string;
  version?: string;
  compiler?: string;

  /** @format int64 */
  cpus?: number;
}

export interface ProcessInfo {
  cpu: number;
  ram: number;
  conns: number;
}

export interface SystemInfo {
  cpu: number;
  ram: number;
  total_ram: number;
  load_avg: number;
  conns: number;
}

export interface MonitorReply {
  pid: ProcessInfo;
  os: SystemInfo;
}

export interface LatencyRecord {
  x: string;
  y: number;
}
