import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}

export interface GetUserParams {
  currentPage: number;
  pageSize: number;
  username?: string; // 账号
  nickname?: string; // 昵称
  deptId?: string; // 部门
}

export interface UserListItem {
  id: string;
  username: string; // 账号
  password?: string; // 密码
  email: string; // 邮箱
  nickname: string; // 昵称
  role: number; // 规则
  createTime: string; // 创建时间
  remark: string; // 备注
  status: number; // 状态
  dept?: string; // 部门
}

export interface GetUserListReply {
  items: UserListItem[];
  total: number;
}

export async function GetUserList(params: GetUserParams) {
  return requestClient.get<GetUserListReply>('/system/user/list', { params });
}

export async function AddUser(data: Omit<UserListItem, 'id'>) {
  return requestClient.post('/system/user', data);
}

export async function UpdateUser(id: string, data: Omit<UserListItem, 'id'>) {
  return requestClient.put(`/system/user/${id}`, data);
}

export async function DelUser(id: string) {
  return requestClient.delete(`/system/user/${id}`);
}
