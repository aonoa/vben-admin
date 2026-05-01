import type {
  api_admin_service_v1_BusinessDomainItem,
  api_admin_service_v1_GetBusinessDomainListReply,
  api_admin_service_v1_GetProjectionSourceStatusListReply,
  api_admin_service_v1_GetServiceRegistryListReply,
  api_admin_service_v1_ProjectionSourceStatusItem,
  api_admin_service_v1_ServiceRegistryItem,
} from '#/api/generated';

import { AdminServiceService } from '#/api/generated';

export type BusinessDomainItem = api_admin_service_v1_BusinessDomainItem;
export type ServiceRegistryItem = api_admin_service_v1_ServiceRegistryItem;
export type ProjectionSourceStatusItem =
  api_admin_service_v1_ProjectionSourceStatusItem;

export interface ListReply<T> {
  items: T[];
  total: number;
}

type RawReply<T> = {
  items?: T[];
  total?: number | string;
};

type RawRecord = Record<string, unknown>;

function normalizeList<TRaw, T>(
  reply: RawReply<TRaw> | undefined,
  normalizeItem: (item: TRaw) => T,
) {
  return {
    items: (reply?.items ?? []).map((item) => normalizeItem(item)),
    total: Number(reply?.total ?? 0),
  };
}

function asRecord(value: unknown): RawRecord {
  return (value ?? {}) as RawRecord;
}

function readString(record: RawRecord, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string') {
      return value;
    }
  }
  return '';
}

function readStringLike(record: RawRecord, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number') {
      return String(value);
    }
  }
  return '';
}

function readNumber(record: RawRecord, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string' && value !== '') {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return 0;
}

function readBoolean(record: RawRecord, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    if (typeof value === 'string') {
      if (value === 'true') {
        return true;
      }
      if (value === 'false') {
        return false;
      }
      if (value !== '') {
        return Number(value) !== 0;
      }
    }
  }
  return false;
}

function normalizeBusinessDomainItem(
  item: api_admin_service_v1_BusinessDomainItem,
): BusinessDomainItem {
  const record = asRecord(item);
  return {
    id: readString(record, 'id'),
    code: readString(record, 'code'),
    name: readString(record, 'name'),
    ownerService: readString(record, 'ownerService', 'owner_service'),
    orgModelType: readString(record, 'orgModelType', 'org_model_type'),
    authScopeType: readString(record, 'authScopeType', 'auth_scope_type'),
    status: readNumber(record, 'status'),
    description: readString(record, 'description'),
    metaJson: readString(record, 'metaJson', 'meta_json'),
    createTime: readString(record, 'createTime', 'create_time'),
  };
}

function normalizeServiceRegistryItem(
  item: api_admin_service_v1_ServiceRegistryItem,
): ServiceRegistryItem {
  const record = asRecord(item);
  return {
    id: readString(record, 'id'),
    serviceCode: readString(record, 'serviceCode', 'service_code'),
    serviceName: readString(record, 'serviceName', 'service_name'),
    domainCode: readString(record, 'domainCode', 'domain_code'),
    httpPrefix: readString(record, 'httpPrefix', 'http_prefix'),
    grpcService: readString(record, 'grpcService', 'grpc_service'),
    status: readNumber(record, 'status'),
    projectionEnabled: readBoolean(
      record,
      'projectionEnabled',
      'projection_enabled',
    ),
    description: readString(record, 'description'),
    createTime: readString(record, 'createTime', 'create_time'),
  };
}

function normalizeProjectionSourceStatusItem(
  item: api_admin_service_v1_ProjectionSourceStatusItem,
): ProjectionSourceStatusItem {
  const record = asRecord(item);
  return {
    id: readString(record, 'id'),
    sourceService: readString(record, 'sourceService', 'source_service'),
    domainCode: readString(record, 'domainCode', 'domain_code'),
    syncMode: readString(record, 'syncMode', 'sync_mode'),
    state: readString(record, 'state'),
    lastSnapshotRevision: readStringLike(
      record,
      'lastSnapshotRevision',
      'last_snapshot_revision',
    ),
    lastSyncTime: readString(record, 'lastSyncTime', 'last_sync_time'),
    lastError: readString(record, 'lastError', 'last_error'),
    description: readString(record, 'description'),
    createTime: readString(record, 'createTime', 'create_time'),
  };
}

export async function getBusinessDomainList(): Promise<
  ListReply<BusinessDomainItem>
> {
  const reply: api_admin_service_v1_GetBusinessDomainListReply =
    await AdminServiceService.adminServiceGetBusinessDomainList();
  return normalizeList(reply, normalizeBusinessDomainItem);
}

export async function addBusinessDomain(data: BusinessDomainItem) {
  return AdminServiceService.adminServiceAddBusinessDomain({
    requestBody: data,
  });
}

export async function updateBusinessDomain(
  id: string,
  data: BusinessDomainItem,
) {
  return AdminServiceService.adminServiceUpdateBusinessDomain({
    id,
    requestBody: data,
  });
}

export async function deleteBusinessDomain(id: string) {
  return AdminServiceService.adminServiceDeleteBusinessDomain({ id });
}

export async function getServiceRegistryList(): Promise<
  ListReply<ServiceRegistryItem>
> {
  const reply: api_admin_service_v1_GetServiceRegistryListReply =
    await AdminServiceService.adminServiceGetServiceRegistryList();
  return normalizeList(reply, normalizeServiceRegistryItem);
}

export async function addServiceRegistry(data: ServiceRegistryItem) {
  return AdminServiceService.adminServiceAddServiceRegistry({
    requestBody: data,
  });
}

export async function updateServiceRegistry(
  id: string,
  data: ServiceRegistryItem,
) {
  return AdminServiceService.adminServiceUpdateServiceRegistry({
    id,
    requestBody: data,
  });
}

export async function deleteServiceRegistry(id: string) {
  return AdminServiceService.adminServiceDeleteServiceRegistry({ id });
}

export async function getProjectionSourceStatusList(): Promise<
  ListReply<ProjectionSourceStatusItem>
> {
  const reply: api_admin_service_v1_GetProjectionSourceStatusListReply =
    await AdminServiceService.adminServiceGetProjectionSourceStatusList();
  return normalizeList(reply, normalizeProjectionSourceStatusItem);
}

export async function addProjectionSourceStatus(
  data: ProjectionSourceStatusItem,
) {
  return AdminServiceService.adminServiceAddProjectionSourceStatus({
    requestBody: data,
  });
}

export async function updateProjectionSourceStatus(
  id: string,
  data: ProjectionSourceStatusItem,
) {
  return AdminServiceService.adminServiceUpdateProjectionSourceStatus({
    id,
    requestBody: data,
  });
}

export async function deleteProjectionSourceStatus(id: string) {
  return AdminServiceService.adminServiceDeleteProjectionSourceStatus({ id });
}
