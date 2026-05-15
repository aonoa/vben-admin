import type { api_admin_service_v1_UserDeptBindingItem } from '#/api/generated';

import { requestClient } from '#/api/request';

export type UserDeptBindingItem = api_admin_service_v1_UserDeptBindingItem;

type RawUserDeptBindingItem = UserDeptBindingItem & {
  create_time?: string;
  dept_id?: string;
  dept_name?: string;
  organization_id?: string;
  update_time?: string;
  user_id?: string;
};

function normalizeBinding(
  binding: RawUserDeptBindingItem,
): UserDeptBindingItem {
  return {
    ...binding,
    createTime: binding.createTime ?? binding.create_time,
    deptId: binding.deptId ?? binding.dept_id,
    deptName: binding.deptName ?? binding.dept_name,
    organizationId: binding.organizationId ?? binding.organization_id,
    updateTime: binding.updateTime ?? binding.update_time,
    userId: binding.userId ?? binding.user_id,
  };
}

export async function getUserDeptBinding(
  userId: string,
  organizationId?: string,
) {
  if (!userId || !organizationId) {
    return undefined;
  }
  const reply = await requestClient.get<RawUserDeptBindingItem>(
    `/admin-api/v1/user-dept-bindings/${userId}`,
    {
      params: {
        organizationId,
      },
    },
  );
  return normalizeBinding(reply);
}

export async function upsertUserDeptBinding(
  userId: string,
  organizationId: string,
  deptId?: string,
) {
  if (!organizationId) {
    return undefined;
  }
  if (!deptId) {
    return deleteUserDeptBinding(userId, organizationId);
  }
  const reply = await requestClient.put<RawUserDeptBindingItem>(
    `/admin-api/v1/user-dept-bindings/${userId}`,
    {
      deptId,
      organizationId,
      userId,
    },
  );
  return normalizeBinding(reply);
}

export async function deleteUserDeptBinding(
  userId: string,
  organizationId?: string,
) {
  return requestClient.delete(`/admin-api/v1/user-dept-bindings/${userId}`, {
    params: {
      organizationId,
    },
  });
}
