import type {
  api_common_service_v1_CreateSiteMessageReply,
  api_common_service_v1_CreateSiteMessageRequest,
  api_common_service_v1_GetMySiteMessageListReply,
  api_common_service_v1_GetMySiteMessageUnreadCountReply,
  api_common_service_v1_GetSiteMessageManageListReply,
  api_common_service_v1_MarkAllSiteMessagesReadReply,
  api_common_service_v1_MarkSiteMessageReadRequest,
  api_common_service_v1_RecallSiteMessageRequest,
} from '#/api/generated';

import { CommonServiceService } from '#/api/generated';

export const SITE_MESSAGE_REFRESH_EVENT = 'site-message:refresh';

export type SiteMessageReadFilter = 'all' | 'read' | 'unread';
export type SiteMessageManageStatus =
  | 'draft'
  | 'published'
  | 'recalled'
  | 'scheduled';
export type SiteMessageManageStatusFilter = 'all' | SiteMessageManageStatus;
export type SiteMessageComposeAction = 'draft' | 'publish' | 'schedule';

export interface SiteMessageItem {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  link: string;
  senderId: string;
  senderName: string;
  createdTime: string;
  readTime: string;
}

export interface SiteMessageManageItem {
  id: string;
  title: string;
  content: string;
  status: SiteMessageManageStatus;
  receiverCount: number;
  link: string;
  senderId: string;
  senderName: string;
  createdTime: string;
  updatedTime: string;
  scheduledPublishTime: string;
  publishedTime: string;
  recalledTime: string;
}

export interface SiteMessageListParams {
  currentPage: number;
  pageSize: number;
  readStatus?: SiteMessageReadFilter;
}

export interface SiteMessageManageListParams {
  currentPage: number;
  pageSize: number;
  status?: SiteMessageManageStatusFilter;
}

export interface SiteMessageListReply {
  items: SiteMessageItem[];
  total: number;
}

export interface SiteMessageManageListReply {
  items: SiteMessageManageItem[];
  total: number;
}

export interface CreateSiteMessagePayload {
  id?: string;
  title: string;
  content: string;
  link?: string;
  action?: SiteMessageComposeAction;
  scheduledPublishTime?: string;
}

export interface CreateSiteMessageResult {
  id: string;
  receiverCount: number;
  status: string;
  scheduledPublishTime: string;
  publishedTime: string;
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

function toNumber(value?: number | string) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeManageStatus(status?: string): SiteMessageManageStatus {
  switch (status) {
    case 'draft': {
      return 'draft';
    }
    case 'recalled': {
      return 'recalled';
    }
    case 'scheduled': {
      return 'scheduled';
    }
    default: {
      return 'published';
    }
  }
}

function normalizeSiteMessageItem(item: unknown): SiteMessageItem {
  const record = asRecord(item);
  return {
    content: readString(record, 'content'),
    createdTime: readString(record, 'createdTime', 'created_time'),
    id: readString(record, 'id'),
    isRead: readBoolean(record, 'isRead', 'is_read'),
    link: readString(record, 'link'),
    readTime: readString(record, 'readTime', 'read_time'),
    senderId: readString(record, 'senderId', 'sender_id'),
    senderName: readString(record, 'senderName', 'sender_name'),
    title: readString(record, 'title'),
  };
}

function normalizeSiteMessageManageItem(item: unknown): SiteMessageManageItem {
  const record = asRecord(item);
  return {
    content: readString(record, 'content'),
    createdTime: readString(record, 'createdTime', 'created_time'),
    id: readString(record, 'id'),
    link: readString(record, 'link'),
    publishedTime: readString(record, 'publishedTime', 'published_time'),
    receiverCount: toNumber(record.receiverCount as number | string),
    recalledTime: readString(record, 'recalledTime', 'recalled_time'),
    scheduledPublishTime: readString(
      record,
      'scheduledPublishTime',
      'scheduled_publish_time',
    ),
    senderId: readString(record, 'senderId', 'sender_id'),
    senderName: readString(record, 'senderName', 'sender_name'),
    status: normalizeManageStatus(readString(record, 'status')),
    title: readString(record, 'title'),
    updatedTime: readString(record, 'updatedTime', 'updated_time'),
  };
}

function mapReadStatus(readStatus: SiteMessageReadFilter = 'all') {
  switch (readStatus) {
    case 'read': {
      return 1;
    }
    case 'unread': {
      return 2;
    }
    default: {
      return 0;
    }
  }
}

function mapManageStatusFilter(status: SiteMessageManageStatusFilter = 'all') {
  return status === 'all' ? undefined : status;
}

export async function getMySiteMessageList(
  params: SiteMessageListParams,
): Promise<SiteMessageListReply> {
  const reply: api_common_service_v1_GetMySiteMessageListReply =
    await CommonServiceService.commonServiceGetMySiteMessageList({
      currentPage: String(params.currentPage),
      pageSize: String(params.pageSize),
      readStatus: mapReadStatus(params.readStatus),
    });

  return {
    items:
      (asRecord(reply).items as undefined | unknown[])?.map((item) =>
        normalizeSiteMessageItem(item),
      ) ?? [],
    total: toNumber(asRecord(reply).total as number | string),
  };
}

export async function getMySiteMessageUnreadCount() {
  const reply: api_common_service_v1_GetMySiteMessageUnreadCountReply =
    await CommonServiceService.commonServiceGetMySiteMessageUnreadCount();
  return toNumber(asRecord(reply).unreadCount as number | string);
}

export async function markSiteMessageRead(messageId: string) {
  const requestBody: api_common_service_v1_MarkSiteMessageReadRequest = {
    messageId,
  };
  await CommonServiceService.commonServiceMarkSiteMessageRead({
    messageId,
    requestBody,
  });
}

export async function markSiteMessageUnread(messageId: string) {
  const requestBody: api_common_service_v1_MarkSiteMessageReadRequest = {
    messageId,
  };
  await CommonServiceService.commonServiceMarkSiteMessageUnread({
    messageId,
    requestBody,
  });
}

export async function markAllSiteMessagesRead() {
  const reply: api_common_service_v1_MarkAllSiteMessagesReadReply =
    await CommonServiceService.commonServiceMarkAllSiteMessagesRead({
      requestBody: {},
    });
  return toNumber(asRecord(reply).updatedCount as number | string);
}

export async function getSiteMessageManageList(
  params: SiteMessageManageListParams,
): Promise<SiteMessageManageListReply> {
  const reply: api_common_service_v1_GetSiteMessageManageListReply =
    await CommonServiceService.commonServiceGetSiteMessageManageList({
      currentPage: String(params.currentPage),
      pageSize: String(params.pageSize),
      status: mapManageStatusFilter(params.status),
    });

  return {
    items:
      (asRecord(reply).items as undefined | unknown[])?.map((item) =>
        normalizeSiteMessageManageItem(item),
      ) ?? [],
    total: toNumber(asRecord(reply).total as number | string),
  };
}

export async function createSiteMessage(
  payload: CreateSiteMessagePayload,
): Promise<CreateSiteMessageResult> {
  const requestBody: api_common_service_v1_CreateSiteMessageRequest = {
    action: payload.action ?? 'publish',
    category: 'system',
    content: payload.content.trim(),
    id: payload.id,
    link: payload.link?.trim(),
    scheduledPublishTime: payload.scheduledPublishTime?.trim(),
    title: payload.title.trim(),
  };
  const reply: api_common_service_v1_CreateSiteMessageReply =
    await CommonServiceService.commonServiceCreateSiteMessage({
      requestBody,
    });
  const record = asRecord(reply);

  return {
    id: readString(record, 'id'),
    publishedTime: readString(record, 'publishedTime', 'published_time'),
    receiverCount: toNumber(record.receiverCount as number | string),
    scheduledPublishTime: readString(
      record,
      'scheduledPublishTime',
      'scheduled_publish_time',
    ),
    status: readString(record, 'status'),
  };
}

export async function recallSiteMessage(id: string) {
  const requestBody: api_common_service_v1_RecallSiteMessageRequest = { id };
  await CommonServiceService.commonServiceRecallSiteMessage({
    id,
    requestBody,
  });
}

export async function deletePendingSiteMessage(id: string) {
  await CommonServiceService.commonServiceDeletePendingSiteMessage({ id });
}
