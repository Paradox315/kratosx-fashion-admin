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
  captcha_id: string;
  pic_path: string;
}

export type EmptyReply = object;

export type EmptyRequest = object;

export interface LoginReply {
  token?: Token;
  user_id?: string;
  username?: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
  captcha?: string;
  captcha_id?: string;
}

export interface RegisterReply {
  user_id?: string;
  username?: string;
}

export interface RegisterRequest {
  username?: string;
  password?: string;
  email?: string;
  mobile?: string;
  captcha?: string;
  captcha_id?: string;
}

export interface RetrieveRequest {
  username?: string;
  captcha?: string;
  captcha_id?: string;
}

export interface Token {
  access_token?: string;

  /** @format int64 */
  expires_at?: string;
  token_type?: string;
}

export interface UploadReply {
  url?: string;
}
