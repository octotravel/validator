export interface RequestLog {
  id: string;
  service_id: Service;
  session_id: string | null;
  connection_id: string | null;
  created_at: Date;
  env: string;
  action: string | null;
  success: boolean | null;
  status: number;
  req_body: string | null;
  req_method: string | null;
  req_url: string | null;
  req_headers: string | null;
  res_status: number;
  res_headers: string | null;
  res_body: string | null;
  res_duration: number | null;
  res_error: string | null;
  product_ids: string[] | null;
}
