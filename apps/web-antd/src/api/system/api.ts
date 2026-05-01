import type {
  api_admin_service_v1_ApiListItem,
  api_admin_service_v1_GetWalkRouteReply,
} from '#/api/generated';

import { AdminServiceService } from '#/api/generated';

export type ApiListItem = api_admin_service_v1_ApiListItem;
export type GetWalkRouteReply = api_admin_service_v1_GetWalkRouteReply;

export interface GetApiParams {
  currentPage: number | string;
  pageSize: number | string;
  path?: string;
  description?: string;
  method?: string;
  resourcesGroup?: string;
  serviceCode?: string;
  domainCode?: string;
}

export interface GetApiListReply {
  items: ApiListItem[];
  total: number;
}

type RawRecord = Record<string, unknown>;

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

function normalizeApiItem(item: api_admin_service_v1_ApiListItem): ApiListItem {
  const record = asRecord(item);
  return {
    id: readString(record, 'id'),
    path: readString(record, 'path'),
    method: readString(record, 'method'),
    description: readString(record, 'description'),
    module: readString(record, 'module'),
    moduleDescription: readString(
      record,
      'moduleDescription',
      'module_description',
    ),
    resourcesGroup: readString(record, 'resourcesGroup', 'resources_group'),
    serviceCode: readString(record, 'serviceCode', 'service_code'),
    domainCode: readString(record, 'domainCode', 'domain_code'),
  };
}

function toApiRequestBody(data: ApiListItem): api_admin_service_v1_ApiListItem {
  return {
    description: data.description,
    domain_code: data.domainCode,
    id: data.id,
    method: data.method,
    module: data.module,
    module_description: data.moduleDescription,
    path: data.path,
    resources_group: data.resourcesGroup,
    service_code: data.serviceCode,
  } as api_admin_service_v1_ApiListItem;
}

export async function GetWalkRoute() {
  return AdminServiceService.adminServiceGetWalkRoute();
}

export async function GetApiList(params: GetApiParams) {
  const reply = await AdminServiceService.adminServiceGetApiList({
    ...params,
    currentPage: String(params.currentPage),
    pageSize: String(params.pageSize),
  });
  return {
    items: (reply.items ?? []).map((item) => normalizeApiItem(item)),
    total: Number(reply.total ?? 0),
  };
}

export async function AddApi(data: ApiListItem) {
  const reply = await AdminServiceService.adminServiceAddApi({
    requestBody: toApiRequestBody(data),
  });
  return normalizeApiItem(reply);
}

export async function UpdateApi(id: string, data: ApiListItem) {
  const reply = await AdminServiceService.adminServiceUpdateApi({
    id,
    requestBody: toApiRequestBody(data),
  });
  return normalizeApiItem(reply);
}

export async function DelApi(id: string) {
  return AdminServiceService.adminServiceDelApi({ id });
}
