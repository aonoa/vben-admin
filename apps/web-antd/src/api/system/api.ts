import { requestClient } from '#/api/request';

export interface GetApiParams {
  currentPage: number;
  pageSize: number;
}

export interface ApiListItem {
  id: string;
  path: string; // 路径
  method: string; // 方法
  description: string; // 描述
  module: string; // 所属模块
  module_description: number; // 模块描述
  resources_group: string; // 资源组
}

export interface GetApiListReply {
  items: ApiListItem[];
  total: number;
}

export interface WalkRouteItem {
  url: string;
  method: string;
}

export interface GetWalkRouteReply {
  items: WalkRouteItem[];
}

export async function GetWalkRoute() {
  return requestClient.get<GetWalkRouteReply>('/system/getWalkRoute');
}

export async function GetApiList(params: GetApiParams) {
  return requestClient.get<GetApiListReply>('/system/api/list', { params });
}

export async function AddApi(data: Omit<ApiListItem, 'id'>) {
  return requestClient.post('/system/api', data);
}

export async function UpdateApi(id: string, data: Omit<ApiListItem, 'id'>) {
  return requestClient.put(`/system/api/${id}`, data);
}

export async function DelApi(id: string) {
  return requestClient.delete(`/system/api/${id}`);
}
