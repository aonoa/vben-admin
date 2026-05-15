import type { UserListItem } from '#/api';
import type { OrganizationMemberItem } from '#/api/system/organization';

export interface UserListPage {
  currentPage: number;
  pageSize: number;
}

export interface NewUserOrganizationContext {
  currentOrganizationId?: string;
  defaultOrganizationId?: string;
}

export function appendUserId(
  userIds: Array<string | undefined>,
  userId: string,
) {
  const normalizedUserId = userId.trim();
  const next = new Set(
    userIds
      .map((item) => item?.trim())
      .filter((item): item is string => !!item),
  );
  if (normalizedUserId) {
    next.add(normalizedUserId);
  }
  return [...next];
}

export function mergeRoleIds(
  selectedRoleIds: Array<number | string> | number | string | undefined,
  requiredRoleIds: Array<number | string | undefined>,
) {
  let selected: Array<number | string> = [];
  if (Array.isArray(selectedRoleIds)) {
    selected = selectedRoleIds;
  } else if (selectedRoleIds !== undefined) {
    selected = [selectedRoleIds];
  }
  return [...selected, ...requiredRoleIds]
    .map(Number)
    .filter((item) => Number.isFinite(item) && item >= 0)
    .filter((item, index, items) => items.indexOf(item) === index);
}

export function getNewUserOrganizationIds({
  currentOrganizationId,
  defaultOrganizationId,
}: NewUserOrganizationContext) {
  const ids: string[] = [];
  const defaultId = defaultOrganizationId?.trim();
  const currentId = currentOrganizationId?.trim();
  if (defaultId) {
    ids.push(defaultId);
  }
  if (currentId && currentId !== defaultId) {
    ids.push(currentId);
  }
  return ids;
}

export function organizationMemberToUserListItem(
  member: OrganizationMemberItem,
): UserListItem {
  const userId = member.userId ?? '';
  const createTime = member.createTime ?? '';
  return {
    id: userId,
    avatar: member.avatar ?? '',
    createTime,
    create_time: createTime,
    dept: '',
    deptId: undefined,
    email: member.email ?? '',
    nickname: member.nickname ?? '',
    remark: '',
    status: Number(member.userStatus ?? 0),
    username: member.username ?? '',
  };
}

export function matchesQueryValue(value: string | undefined, keyword: unknown) {
  const text = String(keyword ?? '').trim();
  if (!text) {
    return true;
  }
  return String(value ?? '') === text;
}

export function matchesUserStatus(status: number, filter: unknown) {
  const value = Number(filter);
  if (!Number.isFinite(value) || value === 0) {
    return true;
  }
  if (value === 1) {
    return status === 1;
  }
  if (value === 2) {
    return status === 0;
  }
  return true;
}

export function filterUsersByQuery(
  items: UserListItem[],
  query: Record<string, unknown>,
) {
  return items.filter((item) => {
    return (
      matchesQueryValue(item.username, query.username) &&
      matchesQueryValue(item.nickname, query.nickname) &&
      matchesUserStatus(item.status, query.status)
    );
  });
}

export function paginateUsers(items: UserListItem[], page: UserListPage) {
  const pageSize = page.pageSize || items.length || 1;
  const currentPage = page.currentPage || 1;
  const start = (currentPage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function normalizeDeptId(value: unknown) {
  const text = String(value ?? '').trim();
  return text || undefined;
}
