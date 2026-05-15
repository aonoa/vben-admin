import type {
  api_admin_service_v1_OrganizationItem,
  api_admin_service_v1_OrganizationPermissionScopeReply,
  api_admin_service_v1_SaveOrganizationPermissionScopeRequest,
} from '#/api/generated';

export type OrganizationMutationPayload = Pick<
  api_admin_service_v1_OrganizationItem,
  'code' | 'name' | 'orderNo' | 'remark' | 'status'
>;

export function pickOrganizationMutationPayload(
  data: Partial<api_admin_service_v1_OrganizationItem> &
    Record<string, unknown>,
): OrganizationMutationPayload {
  return {
    code: typeof data.code === 'string' ? data.code : String(data.code ?? ''),
    name: typeof data.name === 'string' ? data.name : String(data.name ?? ''),
    orderNo:
      typeof data.orderNo === 'number'
        ? data.orderNo
        : Number(data.orderNo ?? 0),
    remark:
      typeof data.remark === 'string' ? data.remark : String(data.remark ?? ''),
    status:
      typeof data.status === 'number' ? data.status : Number(data.status ?? 0),
  };
}

function normalizeNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return [
    ...new Set(
      value
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item) && item > 0),
    ),
  ].toSorted((left, right) => left - right);
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return [
    ...new Set(
      value
        .map((item) => String(item ?? '').trim())
        .filter((item) => item.length > 0),
    ),
  ].toSorted();
}

export function normalizeOrganizationPermissionScope(
  data:
    | (Partial<api_admin_service_v1_OrganizationPermissionScopeReply> &
        Record<string, unknown>)
    | undefined,
): api_admin_service_v1_OrganizationPermissionScopeReply {
  return {
    organizationId:
      typeof data?.organizationId === 'string'
        ? data.organizationId
        : String(data?.organization_id ?? ''),
    menuIds: normalizeNumberArray(data?.menuIds ?? data?.menu_ids),
    resourceIds: normalizeStringArray(data?.resourceIds ?? data?.resource_ids),
  };
}

export function pickOrganizationPermissionScopePayload(
  organizationId: string,
  data: Partial<api_admin_service_v1_SaveOrganizationPermissionScopeRequest> &
    Record<string, unknown>,
): api_admin_service_v1_SaveOrganizationPermissionScopeRequest {
  return {
    organizationId,
    menuIds: normalizeNumberArray(data.menuIds ?? data.menu_ids),
    resourceIds: normalizeStringArray(data.resourceIds ?? data.resource_ids),
  };
}
