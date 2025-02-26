import type { UserInfo } from '@vben/types';

import { urlToRestful } from '#/api';
import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}

export interface GetAccountParamsRequest {
  currentPage: number;
  pageSize: number;
  account?: string; // 账号
  nickname?: string; // 昵称
  deptId?: string; // 部门
}

export interface AccountListItem {
  id: string;
  account: string; // 账号
  password?: string; // 密码
  email: string; // 邮箱
  nickname: string; // 昵称
  role: number; // 规则
  createTime: string; // 创建时间
  remark: string; // 备注
  status: number; // 状态
  dept?: string; // 部门
}

export interface GetAccountListReply {
  items: AccountListItem[];
  total: number;
}

export async function GetAccountList(params: GetAccountParamsRequest) {
  const newUrl: string = urlToRestful(`/system/getAccountList`, params);
  return requestClient.get<GetAccountListReply>(newUrl);
}

export async function AddUser(params: AccountListItem) {
  return requestClient.post<AccountListItem>('/system/addUser', params);
}

export async function DelUser(params: { id: string }) {
  const newUrl: string = urlToRestful(`/system/delUser/{id}`, params);
  return requestClient.delete<any>(newUrl);
}
