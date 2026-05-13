import type {
  api_admin_service_v1_GetProjectionSourceStatusListReply,
  api_admin_service_v1_GetServiceRegistryListReply,
  api_admin_service_v1_ProjectionSourceStatusItem,
  api_admin_service_v1_ServiceRegistryItem,
} from '#/api/generated';

import { AdminServiceService } from '#/api/generated';

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

function normalizeServiceRegistryItem(
  item: api_admin_service_v1_ServiceRegistryItem,
): ServiceRegistryItem {
  const record = asRecord(item);
  return {
    id: readString(record, 'id'),
    serviceCode: readString(record, 'serviceCode', 'service_code'),
    serviceName: readString(record, 'serviceName', 'service_name'),
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

export async function getServiceRegistryList(): Promise<
  ListReply<ServiceRegistryItem>
> {
  const reply: api_admin_service_v1_GetServiceRegistryListReply =
    await AdminServiceService.adminServiceGetServiceRegistryList();
  return normalizeList(reply, normalizeServiceRegistryItem);
}

export async function getProjectionSourceStatusList(): Promise<
  ListReply<ProjectionSourceStatusItem>
> {
  const reply: api_admin_service_v1_GetProjectionSourceStatusListReply =
    await AdminServiceService.adminServiceGetProjectionSourceStatusList();
  return normalizeList(reply, normalizeProjectionSourceStatusItem);
}
