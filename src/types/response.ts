export interface HttpResponse<T = unknown> {
  error?: any;
  message: string;
  reason: string;
  code: number;
  metadata: T;
}
