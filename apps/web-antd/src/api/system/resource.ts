import { requestClient } from '#/api/request';

export interface GetResourcePageParams {
  currentPage: number;
  pageSize: number;
}

export interface ResourceListItem {
  id: string;
  name: string; // 资源名称
  type: string; // 资源类型
  value: string; // 资源值
  method: string; // 对资源的操作
  description: string; // 资源的描述
}

export interface GetResourceListByPageReply {
  items: ResourceListItem[];
  total: number;
}

export async function GetResourceList(params: GetResourcePageParams) {
  return requestClient.get<GetResourceListByPageReply>(
    '/system/resource/list',
    { params },
  );
}

export async function AddResource(data: Omit<ResourceListItem, 'id'>) {
  return requestClient.post('/system/resource', data);
}

export async function UpdateResource(
  id: string,
  data: Omit<ResourceListItem, 'id'>,
) {
  return requestClient.put(`/system/resource/${id}`, data);
}

export async function DelResource(id: string) {
  return requestClient.delete(`/system/resource/${id}`);
}
