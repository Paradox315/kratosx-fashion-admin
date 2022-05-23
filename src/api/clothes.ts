import service from '@/utils/service';
import { ClothesReply, ClothesRequest } from '@/api/model/clothes';
import { TryOnReply, TryOnRequest } from '@/api/model/tryon';

const prefix = '/api/fashion/v1/clothes';
export function getClothes(id: string) {
  return service.get<ClothesReply>(`${prefix}/${id}`);
}

export function createClothes(clothes: ClothesRequest) {
  return service.post(prefix, clothes);
}

export function updateClothes(clothes: ClothesRequest) {
  return service.put(prefix, clothes);
}

export function deleteClothes(id: string) {
  return service.delete(`${prefix}/${id}`);
}

export function tryOnClothes(data: TryOnRequest) {
  return service.post<TryOnReply>(`/api/fashion/v1/tryon/`, data);
}
