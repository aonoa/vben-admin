import type { SystemRoleApi } from './role';

export interface RoleMutationPayload {
  api_permissions: string[];
  data_scope: string;
  data_scope_dept_ids: string[];
  name: string;
  organization_id?: string;
  permissions: number[];
  remark: string;
  status: number;
  value: string;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => String(item ?? '').trim())
    .filter((item) => item.length > 0);
}

function normalizeNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));
}

export function normalizeRoleFormValues(
  data: Partial<SystemRoleApi.SystemRole> & Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...data,
    api_permissions: data.api_permissions ?? data.apiPermissions ?? [],
    data_scope: data.data_scope ?? data.dataScope ?? 'self',
    data_scope_dept_ids:
      data.data_scope_dept_ids ?? data.dataScopeDeptIds ?? [],
    organization_id: data.organization_id ?? data.organizationId,
  };
}

export function pickRoleMutationPayload(
  data: Partial<SystemRoleApi.SystemRole> & Record<string, unknown>,
): RoleMutationPayload {
  const values = normalizeRoleFormValues(data);
  const dataScope =
    typeof values.data_scope === 'string' && values.data_scope.trim()
      ? values.data_scope.trim()
      : 'self';
  return {
    api_permissions: normalizeStringArray(values.api_permissions),
    data_scope: dataScope,
    data_scope_dept_ids:
      dataScope === 'custom_depts'
        ? normalizeStringArray(values.data_scope_dept_ids)
        : [],
    name:
      typeof values.name === 'string' ? values.name : String(values.name ?? ''),
    organization_id:
      typeof values.organization_id === 'string' &&
      values.organization_id.trim()
        ? values.organization_id.trim()
        : undefined,
    permissions: normalizeNumberArray(values.permissions),
    remark:
      typeof values.remark === 'string'
        ? values.remark
        : String(values.remark ?? ''),
    status:
      typeof values.status === 'number'
        ? values.status
        : Number(values.status ?? 0),
    value:
      typeof values.value === 'string'
        ? values.value
        : String(values.value ?? ''),
  };
}
