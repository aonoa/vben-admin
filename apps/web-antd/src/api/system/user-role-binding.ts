import type { api_admin_service_v1_UserRoleBindingItem } from '#/api/generated';

import { requestClient } from '#/api/request';

export type UserRoleBindingItem = api_admin_service_v1_UserRoleBindingItem;

type RawUserRoleBindingItem = UserRoleBindingItem & {
  create_time?: string;
  role_id?: number | string;
  role_ids?: Array<number | string>;
  update_time?: string;
  user_id?: string;
};

function normalizeRoleIds(
  roleIds?: Array<number | string> | null | number | string,
) {
  const values = Array.isArray(roleIds) ? roleIds : [roleIds];
  const ids = values
    .map(Number)
    .filter((item) => Number.isFinite(item) && item >= 0);
  return [...new Set(ids)];
}

function normalizeBinding(
  binding: RawUserRoleBindingItem,
): UserRoleBindingItem {
  const roleIds = normalizeRoleIds(binding.roleIds ?? binding.role_ids);
  const roleId = binding.roleId ?? binding.role_id;
  return {
    ...binding,
    createTime: binding.createTime ?? binding.create_time,
    roleId: roleId === undefined ? undefined : String(roleId),
    roleIds: roleIds.map(String),
    updateTime: binding.updateTime ?? binding.update_time,
    userId: binding.userId ?? binding.user_id,
  };
}

export function getBindingRoleIds(binding?: UserRoleBindingItem) {
  if (!binding) {
    return [];
  }
  const normalizedBinding = normalizeBinding(binding as RawUserRoleBindingItem);
  const ids =
    normalizedBinding.roleIds && normalizedBinding.roleIds.length > 0
      ? normalizedBinding.roleIds
      : (normalizedBinding.roleId === undefined
        ? []
        : [normalizedBinding.roleId]);
  return normalizeRoleIds(ids);
}

export async function listUserRoleBindings() {
  const reply = await requestClient.get<{ items?: RawUserRoleBindingItem[] }>(
    '/admin-api/v1/user-role-bindings',
  );
  return {
    ...reply,
    items: (reply.items ?? []).map((item) => normalizeBinding(item)),
  };
}

export async function getUserRoleBinding(userId: string) {
  if (!userId) {
    return undefined;
  }
  const reply = await requestClient.get<RawUserRoleBindingItem>(
    `/admin-api/v1/user-role-bindings/${userId}`,
  );
  return normalizeBinding(reply);
}

export async function upsertUserRoleBinding(
  userId: string,
  roleIds: Array<number | string> | number | string,
) {
  const ids = normalizeRoleIds(roleIds);
  if (ids.length === 0) {
    return deleteUserRoleBinding(userId);
  }
  const reply = await requestClient.put<RawUserRoleBindingItem>(
    `/admin-api/v1/user-role-bindings/${userId}`,
    {
      userId,
      roleId: String(ids[0]),
      roleIds: ids.map(String),
    },
  );
  return normalizeBinding(reply);
}

export async function deleteUserRoleBinding(userId: string) {
  return requestClient.delete(`/admin-api/v1/user-role-bindings/${userId}`);
}
