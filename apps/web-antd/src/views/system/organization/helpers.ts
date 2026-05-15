import type { OrganizationMemberItem } from '#/api/system/organization';

export interface OrganizationMemberRow {
  avatar: string;
  createTime: string;
  email: string;
  memberStatus: number;
  nickname: string;
  primary: boolean;
  status: number;
  userId: string;
  username: string;
}

export interface OrganizationMemberScopedRow extends OrganizationMemberRow {
  inCurrentOrganization: boolean;
}

type OrganizationMemberSearchMode = 'email' | 'id' | 'text';

export interface OrganizationMemberPage {
  currentPage: number;
  pageSize: number;
}

export function canManageOrganizationButtons(backendCapability: boolean) {
  return backendCapability;
}

export function normalizeOrganizationMember(
  member: OrganizationMemberItem,
): null | OrganizationMemberRow {
  const userId = String(member.userId ?? '').trim();
  if (!userId) {
    return null;
  }
  return {
    avatar: member.avatar ?? '',
    createTime: member.createTime ?? '',
    email: member.email ?? '',
    memberStatus: Number(member.memberStatus ?? 0),
    nickname: member.nickname ?? '',
    primary: Boolean(member.primary),
    status: Number(member.userStatus ?? 0),
    userId,
    username: member.username ?? '',
  };
}

export function normalizeOrganizationMembers(items: OrganizationMemberItem[]) {
  return items
    .map((item) => normalizeOrganizationMember(item))
    .filter((item): item is OrganizationMemberRow => !!item);
}

export function filterOrganizationMembers<T extends OrganizationMemberRow>(
  items: T[],
  keyword: string,
) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) {
    return items;
  }
  const { mode, value } = parseOrganizationMemberKeyword(normalizedKeyword);
  if (!value) {
    return items;
  }
  return items.filter((item) => {
    if (mode === 'email') {
      return item.email.toLowerCase().includes(value);
    }
    if (mode === 'id') {
      return item.userId.toLowerCase().includes(value);
    }
    return (
      item.nickname.toLowerCase().includes(value) ||
      item.username.toLowerCase().includes(value)
    );
  });
}

export function paginateOrganizationMembers<T extends OrganizationMemberRow>(
  items: T[],
  page: OrganizationMemberPage,
) {
  const pageSize = page.pageSize || items.length || 1;
  const currentPage = page.currentPage || 1;
  const start = (currentPage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function collectOrganizationMemberIds(
  items: Array<Pick<OrganizationMemberRow, 'userId'>>,
) {
  return items
    .map((item) => item.userId.trim())
    .filter((item): item is string => !!item);
}

export function appendOrganizationMemberId(userIds: string[], userId: string) {
  const normalizedUserId = userId.trim();
  const next = new Set(
    userIds.map((item) => item.trim()).filter((item): item is string => !!item),
  );
  if (normalizedUserId) {
    next.add(normalizedUserId);
  }
  return [...next];
}

export function removeOrganizationMemberId(userIds: string[], userId: string) {
  const normalizedUserId = userId.trim();
  return userIds
    .map((item) => item.trim())
    .filter((item): item is string => !!item && item !== normalizedUserId);
}

export function markCurrentOrganizationMembers(
  items: OrganizationMemberRow[],
  currentMemberIds: string[],
): OrganizationMemberScopedRow[] {
  const currentMemberSet = new Set(
    currentMemberIds
      .map((item) => item.trim())
      .filter((item): item is string => !!item),
  );
  return items.map((item) => ({
    ...item,
    inCurrentOrganization: currentMemberSet.has(item.userId),
  }));
}

function parseOrganizationMemberKeyword(keyword: string): {
  mode: OrganizationMemberSearchMode;
  value: string;
} {
  if (keyword.includes('@')) {
    return {
      mode: 'email',
      value: keyword,
    };
  }
  if (/^(?:id|uid)[:：]/i.test(keyword)) {
    return {
      mode: 'id',
      value: keyword.replace(/^(?:id|uid)[:：]/i, '').trim(),
    };
  }
  return {
    mode: 'text',
    value: keyword,
  };
}
