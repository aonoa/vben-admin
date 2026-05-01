import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi(id: string) {
  return requestClient.get<UserInfo>(`/user-api/v1/users/${id}`);
}

export async function getInfoApi() {
  return requestClient.get<UserInfo>(`/user-api/v1/users/info`);
}

export interface GetUserParams {
  currentPage: number;
  pageSize: number;
  username?: string; // 账号
  nickname?: string; // 昵称
  deptId?: string; // 部门
  role?: number | string; // 前端按 admin 角色绑定过滤
}

export interface UserListItem {
  id: string;
  username: string; // 账号
  password?: string; // 密码
  email: string; // 邮箱
  nickname: string; // 昵称
  role?: number | number[]; // 角色绑定由 admin 服务维护
  roleIds?: number[];
  roleNames?: string[];
  create_time: string; // 创建时间
  remark: string; // 备注
  status: number; // 状态
  dept?: string; // 部门
}

export interface GetUserListReply {
  items: UserListItem[];
  total: number;
}

export async function GetUserList(params: GetUserParams) {
  return requestClient.get<GetUserListReply>('/user-api/v1/users', { params });
}

export async function AddUser(data: Omit<UserListItem, 'id'>) {
  return requestClient.post('/user-api/v1/users', data);
}

export async function UpdateUser(id: string, data: Omit<UserListItem, 'id'>) {
  return requestClient.put(`/user-api/v1/users/${id}`, data);
}

export async function DelUser(id: string) {
  return requestClient.delete(`/user-api/v1/users/${id}`);
}
