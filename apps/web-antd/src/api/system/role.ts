import { urlToRestful } from '#/api';
import { requestClient } from '#/api/request';

export interface RolePageParams {
  currentPage: number;
  pageSize: number;
  roleNme?: string; // 角色名
  status?: number; // 状态
  deptId?: string; // 部门
}

export interface RoleListItem {
  id: string;
  roleName: string; // 角色名
  roleValue: string; // 角色值
  status: number; // 状态
  orderNo: string; // 排序
  createTime: string; // 创建时间
  remark?: string; // 备注
  dept?: string; // 部门
  menu?: string[]; // 菜单列表
}

export interface GetRoleListByPageReply {
  items: RoleListItem[];
  total: number;
}

export async function GetRoleListByPage(params: RolePageParams) {
  const newUrl: string = urlToRestful(`/system/getRoleListByPage`, params);
  return requestClient.get<GetRoleListByPageReply>(newUrl);
}
