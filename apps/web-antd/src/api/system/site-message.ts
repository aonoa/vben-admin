import { BaseService } from '#/api/generated';

export const SITE_MESSAGE_REFRESH_EVENT = 'site-message:refresh';

export type SiteMessageReadFilter = 'all' | 'read' | 'unread';
export type SiteMessageReceiverType = 'all' | 'user';
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
  summary: string;
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
  summary: string;
  content: string;
  status: SiteMessageManageStatus;
  receiverType: SiteMessageReceiverType;
  receiverIds: string[];
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
  summary: string;
  content: string;
  receiverType?: SiteMessageReceiverType;
  receiverIds?: string[];
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

function toNumber(value?: number | string) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeReceiverType(
  receiverType?: string,
): SiteMessageReceiverType {
  return receiverType === 'user' ? 'user' : 'all';
}

function normalizeManageStatus(status?: string): SiteMessageManageStatus {
  switch (status) {
    case 'draft':
      return 'draft';
    case 'scheduled':
      return 'scheduled';
    case 'recalled':
      return 'recalled';
    default:
      return 'published';
  }
}

function normalizeSiteMessageItem(
  item: Record<string, any> = {},
): SiteMessageItem {
  return {
    content: item.content ?? '',
    createdTime: item.createdTime ?? '',
    id: item.id ?? '',
    isRead: Boolean(item.isRead),
    link: item.link ?? '',
    readTime: item.readTime ?? '',
    senderId: item.senderId ?? '',
    senderName: item.senderName ?? '',
    summary: item.category ?? '',
    title: item.title ?? '',
  };
}

function normalizeSiteMessageManageItem(
  item: Record<string, any> = {},
): SiteMessageManageItem {
  return {
    content: item.content ?? '',
    createdTime: item.createdTime ?? '',
    id: item.id ?? '',
    link: item.link ?? '',
    publishedTime: item.publishedTime ?? '',
    receiverCount: toNumber(item.receiverCount),
    receiverIds: Array.isArray(item.receiverIds) ? item.receiverIds : [],
    receiverType: normalizeReceiverType(item.receiverType),
    recalledTime: item.recalledTime ?? '',
    scheduledPublishTime: item.scheduledPublishTime ?? '',
    senderId: item.senderId ?? '',
    senderName: item.senderName ?? '',
    status: normalizeManageStatus(item.status),
    summary: item.category ?? '',
    title: item.title ?? '',
    updatedTime: item.updatedTime ?? '',
  };
}

function mapReadStatus(readStatus: SiteMessageReadFilter = 'all') {
  switch (readStatus) {
    case 'read':
      return 1;
    case 'unread':
      return 2;
    default:
      return 0;
  }
}

function mapManageStatusFilter(
  status: SiteMessageManageStatusFilter = 'all',
) {
  return status === 'all' ? undefined : status;
}

export async function getMySiteMessageList(
  params: SiteMessageListParams,
): Promise<SiteMessageListReply> {
  const reply = await BaseService.baseGetMySiteMessageList({
    currentPage: String(params.currentPage),
    pageSize: String(params.pageSize),
    readStatus: mapReadStatus(params.readStatus),
  });

  return {
    items: (reply.items ?? []).map((item: Record<string, any>) =>
      normalizeSiteMessageItem(item),
    ),
    total: toNumber(reply.total),
  };
}

export async function getMySiteMessageUnreadCount() {
  const reply = await BaseService.baseGetMySiteMessageUnreadCount();
  return toNumber(reply.unreadCount);
}

export async function markSiteMessageRead(messageId: string) {
  await BaseService.baseMarkSiteMessageRead({
    messageId,
    requestBody: {
      messageId,
    },
  });
}

export async function markSiteMessageUnread(messageId: string) {
  await BaseService.baseMarkSiteMessageUnread({
    messageId,
    requestBody: {
      messageId,
    },
  });
}

export async function markAllSiteMessagesRead() {
  const reply = await BaseService.baseMarkAllSiteMessagesRead({
    requestBody: {},
  });
  return toNumber(reply.updatedCount);
}

export async function getSiteMessageManageList(
  params: SiteMessageManageListParams,
): Promise<SiteMessageManageListReply> {
  const reply = await BaseService.baseGetPublishedSiteMessageList({
    currentPage: String(params.currentPage),
    pageSize: String(params.pageSize),
    status: mapManageStatusFilter(params.status),
  });

  return {
    items: (reply.items ?? []).map((item: Record<string, any>) =>
      normalizeSiteMessageManageItem(item),
    ),
    total: toNumber(reply.total),
  };
}

export async function createSiteMessage(
  payload: CreateSiteMessagePayload,
): Promise<CreateSiteMessageResult> {
  const receiverType =
    payload.receiverType ?? (payload.receiverIds?.length ? 'user' : 'all');
  const receiverIds =
    receiverType === 'user' ? (payload.receiverIds ?? []) : [];

  const reply = await BaseService.baseCreateSiteMessage({
    requestBody: {
      action: payload.action ?? 'publish',
      category: payload.summary.trim(),
      content: payload.content.trim(),
      id: payload.id,
      link: payload.link?.trim(),
      receiverIds,
      receiverType,
      scheduledPublishTime: payload.scheduledPublishTime?.trim(),
      title: payload.title.trim(),
    },
  });

  return {
    id: reply.id ?? '',
    publishedTime: reply.publishedTime ?? '',
    receiverCount: toNumber(reply.receiverCount),
    scheduledPublishTime: reply.scheduledPublishTime ?? '',
    status: reply.status ?? '',
  };
}

export async function recallSiteMessage(id: string) {
  await BaseService.baseRecallSiteMessage({
    id,
    requestBody: { id },
  });
}

export async function deletePendingSiteMessage(id: string) {
  await BaseService.baseDeletePendingSiteMessage({ id });
}
