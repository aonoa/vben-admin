import type {
  api_admin_service_v1_CurrentOrganizationReply,
  api_admin_service_v1_GetMyOrganizationsReply,
  api_admin_service_v1_GetOrganizationMembersReply,
  api_admin_service_v1_MyOrganizationItem,
  api_admin_service_v1_OrganizationItem,
  api_admin_service_v1_OrganizationMemberItem,
  api_admin_service_v1_OrganizationPermissionCatalogReply,
  api_admin_service_v1_OrganizationPermissionScopeReply,
  api_admin_service_v1_ResourceListItem,
  api_admin_service_v1_SysMenuListItem,
} from '#/api/generated';

import { AdminServiceService } from '#/api/generated';
import { requestClient } from '#/api/request';

import {
  normalizeOrganizationPermissionScope,
  pickOrganizationMutationPayload,
  pickOrganizationPermissionScopePayload,
} from './organization-payload';

export type OrganizationItem = api_admin_service_v1_OrganizationItem;
export type MyOrganizationItem = api_admin_service_v1_MyOrganizationItem;
export type OrganizationMemberItem =
  api_admin_service_v1_OrganizationMemberItem;
export type OrganizationPermissionCatalog =
  api_admin_service_v1_OrganizationPermissionCatalogReply;
export type OrganizationPermissionScope =
  api_admin_service_v1_OrganizationPermissionScopeReply;
export type OrganizationPermissionMenu = api_admin_service_v1_SysMenuListItem;
export type OrganizationPermissionResource =
  api_admin_service_v1_ResourceListItem;

export interface OrganizationListParams {
  code?: string;
  currentPage?: number;
  name?: string;
  pageSize?: number;
  status?: number;
}

export interface OrganizationListReply<T> {
  canManageOrganizations: boolean;
  items: T[];
  total: number;
}

type OrganizationListLikeReply = {
  can_manage_organizations?: unknown;
  canManageOrganizations?: unknown;
  items?: unknown[];
  total?: unknown;
};

export function normalizeListReply<T>(
  reply: OrganizationListLikeReply | undefined,
) {
  const record = reply as Record<string, unknown> | undefined;
  return {
    canManageOrganizations:
      normalizeBooleanFlag(record?.canManageOrganizations) ||
      normalizeBooleanFlag(record?.can_manage_organizations),
    items: ((reply?.items ?? []) as T[]).map((item) => normalizeKeys(item)),
    total: Number(reply?.total ?? 0),
  };
}

function normalizeBooleanFlag(value: unknown) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    return ['1', 'true', 'yes'].includes(value.trim().toLowerCase());
  }
  return false;
}

function normalizeKeys<T>(item: T): T {
  const record = item as Record<string, unknown>;
  return {
    ...item,
    createTime: record.createTime ?? record.create_time,
    currentOrganizationId:
      record.currentOrganizationId ?? record.current_organization_id,
    deptCount: record.deptCount ?? record.dept_count,
    memberCount: record.memberCount ?? record.member_count,
    memberStatus: record.memberStatus ?? record.member_status,
    orderNo: record.orderNo ?? record.order_no,
    updateTime: record.updateTime ?? record.update_time,
    userId: record.userId ?? record.user_id,
    userStatus: record.userStatus ?? record.user_status,
  };
}

export async function getOrganizationList(
  params: OrganizationListParams = {},
): Promise<OrganizationListReply<OrganizationItem>> {
  const reply = await AdminServiceService.adminServiceGetOrganizationList({
    code: params.code,
    currentPage:
      params.currentPage === undefined ? undefined : String(params.currentPage),
    name: params.name,
    pageSize:
      params.pageSize === undefined ? undefined : String(params.pageSize),
    status: params.status,
  });
  return normalizeListReply<OrganizationItem>(reply);
}

export async function createOrganization(data: Omit<OrganizationItem, 'id'>) {
  return AdminServiceService.adminServiceAddOrganization({
    requestBody: pickOrganizationMutationPayload(data),
  });
}

export async function updateOrganization(
  id: string,
  data: Omit<OrganizationItem, 'id'>,
) {
  return AdminServiceService.adminServiceUpdateOrganization({
    id,
    requestBody: pickOrganizationMutationPayload(data),
  });
}

export async function deleteOrganization(id: string) {
  return AdminServiceService.adminServiceDelOrganization({ id });
}

export async function getOrganizationMembers(
  organizationId: string,
): Promise<OrganizationListReply<OrganizationMemberItem>> {
  const reply =
    await requestClient.get<api_admin_service_v1_GetOrganizationMembersReply>(
      `/admin-api/v1/organizations/${organizationId}/members`,
    );
  return normalizeListReply<OrganizationMemberItem>(reply);
}

export async function getMyOrganizations(): Promise<{
  currentOrganizationId: string;
  items: MyOrganizationItem[];
}> {
  const reply = (await AdminServiceService.adminServiceGetMyOrganizations()) as
    | api_admin_service_v1_GetMyOrganizationsReply
    | undefined;
  const record = reply as Record<string, unknown> | undefined;
  return {
    currentOrganizationId:
      reply?.currentOrganizationId ??
      (typeof record?.current_organization_id === 'string'
        ? record.current_organization_id
        : ''),
    items: ((reply?.items ?? []) as MyOrganizationItem[]).map((item) =>
      normalizeKeys(item),
    ),
  };
}

export async function switchCurrentOrganization(
  organizationId: string,
): Promise<{
  current?: MyOrganizationItem;
  currentOrganizationId: string;
}> {
  const reply =
    (await AdminServiceService.adminServiceSwitchCurrentOrganization({
      requestBody: { organizationId },
    })) as api_admin_service_v1_CurrentOrganizationReply | undefined;
  const record = reply as Record<string, unknown> | undefined;
  return {
    current: reply?.current ? normalizeKeys(reply.current) : undefined,
    currentOrganizationId:
      reply?.currentOrganizationId ??
      (typeof record?.current_organization_id === 'string'
        ? record.current_organization_id
        : organizationId),
  };
}

export async function saveOrganizationMembers(
  organizationId: string,
  userIds: string[],
) {
  const reply =
    await requestClient.put<api_admin_service_v1_GetOrganizationMembersReply>(
      `/admin-api/v1/organizations/${organizationId}/members`,
      {
        organizationId,
        userIds,
      },
    );
  return normalizeListReply<OrganizationMemberItem>(reply);
}

export async function getOrganizationPermissionScope(
  organizationId: string,
): Promise<OrganizationPermissionScope> {
  const reply =
    await AdminServiceService.adminServiceGetOrganizationPermissionScope({
      organizationId,
    });
  return normalizeOrganizationPermissionScope(reply);
}

export async function saveOrganizationPermissionScope(
  organizationId: string,
  data: Partial<OrganizationPermissionScope> & Record<string, unknown>,
): Promise<OrganizationPermissionScope> {
  const reply =
    await AdminServiceService.adminServiceSaveOrganizationPermissionScope({
      organizationId,
      requestBody: pickOrganizationPermissionScopePayload(organizationId, data),
    });
  return normalizeOrganizationPermissionScope(reply);
}

export async function getCurrentPermissionCatalog(): Promise<OrganizationPermissionCatalog> {
  return AdminServiceService.adminServiceGetCurrentPermissionCatalog();
}

export async function getOrganizationPermissionCatalog(
  organizationId: string,
): Promise<OrganizationPermissionCatalog> {
  return AdminServiceService.adminServiceGetOrganizationPermissionCatalog({
    organizationId,
  });
}
