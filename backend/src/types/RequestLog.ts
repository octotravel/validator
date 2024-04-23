import { Environment } from '@octocloud/core';

export interface GetRequestsFilter {
  limit: number;
  createdAt: Date | null;
  parentId: string | null;
  connectionId: string | null;
  connectionChannel: Channel | null;
  env: string | null;
  accountId: string | null;
  action: string | null;
  search: string | null;
  status: string | null;
  productId: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  service: Service | null;
}

export interface RequestLog {
  id: string;
  parent_id: string | null;
  service_id: Service;
  account_id: string | null;
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

export interface RequestLogViewItem {
  id: string;
  created_at: Date;
  connection_channel: string;
  connection_name: string;
  environment: Environment;
  accoung_id: string | null;
  accoung_name: string | null;
  action: string;
  success: boolean | null;
  status: number;
  res_duration: number | null;
}

export interface RequestLogDetailItem {
  id: string;
  created_at: Date;
  connection_channel: string;
  connection_name: string;
  environment: Environment;
  account_id: string | null;
  account_name: string | null;
  action: string;
  success: boolean | null;
  status: number;
  res_duration: number | null;
  req_body: string | null;
  req_method: string | null;
  req_url: string | null;
  req_headers: string | null;
  res_status: number;
  res_headers: string | null;
  res_body: string | null;
  res_error: string | null;
  subrequests: SubrequestDetailItem[];
}

export interface SubrequestDetailItem {
  request: {
    url: string | null;
    method: string | null;
    body: string | null;
    headers: string | null;
  };
  response: {
    status: number;
    body: string | null;
    headers: string | null;
    duration: number | null;
    error: string | null;
  };
}
