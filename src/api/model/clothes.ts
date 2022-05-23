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

export interface ClothesReply {
  id?: string;
  type?: string;
  description?: string;
  image?: string;
  brand?: string;
  style?: string;
  region?: string;
  time?: string;

  /** @format float */
  price?: number;
  colors?: string[];
}

export interface ClothesRequest {
  id?: string;
  type?: string;
  description?: string;
  image?: string;
  brand?: string;
  style?: string;
  region?: string;

  /** @format float */
  price?: number;
  colors?: string[];
  labels?: string[];
}

export interface RecommendReply {
  list?: ClothesReply[];
  type?: string;
}
