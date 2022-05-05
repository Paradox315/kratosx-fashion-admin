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

export interface CaptchaReply {
  captchaId: string;
  picPath: string;
}

export interface LoginReply {
  accessToken: string;
  refreshToken: string;

  /** @format int64 */
  expiresAt: string;
  tokenType: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  captcha: string;
  captchaId: string;
}

export interface RefreshReply {
  accessToken: string;
  refreshToken: string;

  /** @format int64 */
  expiresAt: string;
  tokenType: string;
}

export interface RefreshRequest {
  refreshToken?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  mobile?: string;
  captcha?: string;
  captchaId?: string;
}

export interface RetrieveRequest {
  username?: string;
  captcha?: string;
  captchaId?: string;
}

export interface UploadReply {
  url: string;
}
