/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_common_service_v1_CreateSiteMessageReply } from '../models/api_common_service_v1_CreateSiteMessageReply';
import type { api_common_service_v1_CreateSiteMessageRequest } from '../models/api_common_service_v1_CreateSiteMessageRequest';
import type { api_common_service_v1_GetMySiteMessageListReply } from '../models/api_common_service_v1_GetMySiteMessageListReply';
import type { api_common_service_v1_GetMySiteMessageUnreadCountReply } from '../models/api_common_service_v1_GetMySiteMessageUnreadCountReply';
import type { api_common_service_v1_GetSiteMessageManageListReply } from '../models/api_common_service_v1_GetSiteMessageManageListReply';
import type { api_common_service_v1_MarkAllSiteMessagesReadReply } from '../models/api_common_service_v1_MarkAllSiteMessagesReadReply';
import type { api_common_service_v1_MarkSiteMessageReadRequest } from '../models/api_common_service_v1_MarkSiteMessageReadRequest';
import type { api_common_service_v1_RecallSiteMessageRequest } from '../models/api_common_service_v1_RecallSiteMessageRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CommonServiceService {
  /**
   * @returns api_common_service_v1_GetSiteMessageManageListReply OK
   * @throws ApiError
   */
  public static commonServiceGetSiteMessageManageList({
    currentPage,
    pageSize,
    status,
  }: {
    currentPage?: string;
    pageSize?: string;
    status?: string;
  }): CancelablePromise<api_common_service_v1_GetSiteMessageManageListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/common-api/v1/site-messages/manage',
      query: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: status,
      },
    });
  }
  /**
   * @returns api_common_service_v1_CreateSiteMessageReply OK
   * @throws ApiError
   */
  public static commonServiceCreateSiteMessage({
    requestBody,
  }: {
    requestBody: api_common_service_v1_CreateSiteMessageRequest;
  }): CancelablePromise<api_common_service_v1_CreateSiteMessageReply> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/common-api/v1/site-messages/manage',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static commonServiceDeletePendingSiteMessage({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/common-api/v1/site-messages/manage/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static commonServiceRecallSiteMessage({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_common_service_v1_RecallSiteMessageRequest;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/common-api/v1/site-messages/manage/{id}/recall',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_common_service_v1_GetMySiteMessageListReply OK
   * @throws ApiError
   */
  public static commonServiceGetMySiteMessageList({
    currentPage,
    pageSize,
    readStatus,
  }: {
    currentPage?: string;
    pageSize?: string;
    readStatus?: number;
  }): CancelablePromise<api_common_service_v1_GetMySiteMessageListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/common-api/v1/site-messages/my',
      query: {
        currentPage: currentPage,
        pageSize: pageSize,
        readStatus: readStatus,
      },
    });
  }
  /**
   * @returns api_common_service_v1_MarkAllSiteMessagesReadReply OK
   * @throws ApiError
   */
  public static commonServiceMarkAllSiteMessagesRead({
    requestBody,
  }: {
    requestBody: any;
  }): CancelablePromise<api_common_service_v1_MarkAllSiteMessagesReadReply> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/common-api/v1/site-messages/my/read-all',
      body: requestBody,
    });
  }
  /**
   * @returns api_common_service_v1_GetMySiteMessageUnreadCountReply OK
   * @throws ApiError
   */
  public static commonServiceGetMySiteMessageUnreadCount(): CancelablePromise<api_common_service_v1_GetMySiteMessageUnreadCountReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/common-api/v1/site-messages/my/unread-count',
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static commonServiceMarkSiteMessageRead({
    messageId,
    requestBody,
  }: {
    messageId: string;
    requestBody: api_common_service_v1_MarkSiteMessageReadRequest;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/common-api/v1/site-messages/my/{messageId}/read',
      path: {
        messageId: messageId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static commonServiceMarkSiteMessageUnread({
    messageId,
    requestBody,
  }: {
    messageId: string;
    requestBody: api_common_service_v1_MarkSiteMessageReadRequest;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/common-api/v1/site-messages/my/{messageId}/unread',
      path: {
        messageId: messageId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
