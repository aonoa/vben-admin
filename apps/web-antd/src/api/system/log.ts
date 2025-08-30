import { requestClient } from '#/api/request';

export interface GetSysLogListParams {
  currentPage: number;
  pageSize: number;
  user_id: string;
  user_name: string;
  is_login: boolean;
  session_id: string;
  method: string;
  path: string;
  request_time_start: string;
  request_time_end: string;
  ip_address: string;
  latency: number;
  res_code: number;
  res_status: boolean;
}

export interface SysLogItem {
  id: string;
  user_id: string;
  user_name: string;
  method: string;
  path: string;
  request_time: string;
  ip_address: string;
  ip_location: string;
  latency: number;
  os: string;
  browser: string;
  res_code: number;
  res_status: boolean;
}

export interface GetSysLogListReply {
  items: SysLogItem[];
  total: number;
}

export interface GetSysLogInfoReply {
  id: string; // 日志ID
  user_id: string; // 用户ID
  user_name: string;
  is_login: boolean; // 是否登录日志
  session_id: string; // 会话ID
  method: string; // 请求方式
  path: string; // 请求地址
  request_time: string; // 请求时间
  ip_address: string; // 访问IP
  ip_location: string; // IP归属地
  latency: number; // 请求耗时
  os: string;
  browser: string;
  user_agent: string; // 代理信息
  header: string; // 请求头
  get_params: string; // GET参数
  post_data: string; // POST参数
  res_code: number;
  reason: string; // 报错信息
  res_status: boolean;
  stack: string; // 堆栈信息
  create_time: string; // 响应时间
}

export async function GetSysLogList(params: GetSysLogListParams) {
  return requestClient.get<GetSysLogListReply>('/system/log/list', { params });
}

export async function GetSysLogInfo(id: string) {
  return requestClient.get<GetSysLogInfoReply>(`/system/log/${id}`);
}
