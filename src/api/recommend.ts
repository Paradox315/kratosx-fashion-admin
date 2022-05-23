import { Pagination } from '@/types/global';
import { RecommendReply } from '@/api/model/clothes';
import service from '@/utils/service';

const prefix = '/api/fashion/v1/recommend';
export function getPopular(params: Pagination) {
  return service.get<RecommendReply>(`${prefix}/popular`, { params });
}

export function getLatest(params: Pagination) {
  return service.get<RecommendReply>(`${prefix}/latest`, { params });
}
