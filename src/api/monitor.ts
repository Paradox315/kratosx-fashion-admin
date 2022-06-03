import service from '@/utils/service';
import { DiskReply, MonitorReply, RuntimeReply } from '@/api/model/monitor';
import axios from 'axios';

const prefix = '/api/system/v1/monitor';
export function getRuntimeInfo() {
  return service.get<RuntimeReply>(`${prefix}/runtime/`);
}
export function getDiskInfo() {
  return service.get<DiskReply>(`${prefix}/disk/`);
}
export function getMonitorInfo() {
  return axios.get<any, MonitorReply>('/monitor');
}
