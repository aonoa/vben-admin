/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_user_service_v1_ChangePasswordRequest } from '../models/api_user_service_v1_ChangePasswordRequest';
import type { api_user_service_v1_GetUserInfoReply } from '../models/api_user_service_v1_GetUserInfoReply';
import type { api_user_service_v1_GetUserListReply } from '../models/api_user_service_v1_GetUserListReply';
import type { api_user_service_v1_IsUserExistsReply } from '../models/api_user_service_v1_IsUserExistsReply';
import type { api_user_service_v1_UserListItem } from '../models/api_user_service_v1_UserListItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserServiceService {
  /**
   * @returns api_user_service_v1_GetUserListReply OK
   * @throws ApiError
   */
  public static userServiceGetUserList({
    currentPage,
    pageSize,
    username,
    nickname,
    deptId,
    status,
  }: {
    currentPage?: string;
    pageSize?: string;
    username?: string;
    nickname?: string;
    deptId?: string;
    status?: number;
  }): CancelablePromise<api_user_service_v1_GetUserListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/user-api/v1/users',
      query: {
        currentPage: currentPage,
        pageSize: pageSize,
        username: username,
        nickname: nickname,
        deptId: deptId,
        status: status,
      },
    });
  }
  /**
   * @returns api_user_service_v1_UserListItem OK
   * @throws ApiError
   */
  public static userServiceAddUser({
    requestBody,
  }: {
    requestBody: api_user_service_v1_UserListItem;
  }): CancelablePromise<api_user_service_v1_UserListItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/user-api/v1/users',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_user_service_v1_IsUserExistsReply OK
   * @throws ApiError
   */
  public static userServiceIsUserExist({
    id,
    username,
  }: {
    id?: string;
    username?: string;
  }): CancelablePromise<api_user_service_v1_IsUserExistsReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/user-api/v1/users/check',
      query: {
        id: id,
        username: username,
      },
    });
  }
  /**
   * @returns api_user_service_v1_UserListItem OK
   * @throws ApiError
   */
  public static userServiceUpdateUser({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_user_service_v1_UserListItem;
  }): CancelablePromise<api_user_service_v1_UserListItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/user-api/v1/users/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static userServiceDelUser({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/user-api/v1/users/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns api_user_service_v1_GetUserInfoReply OK
   * @throws ApiError
   */
  public static userServiceGetUserInfo({
    userId,
  }: {
    userId: string;
  }): CancelablePromise<api_user_service_v1_GetUserInfoReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/user-api/v1/users/{userId}',
      path: {
        userId: userId,
      },
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static userServiceChangePassword({
    userId,
    requestBody,
  }: {
    userId: string;
    requestBody: api_user_service_v1_ChangePasswordRequest;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/user-api/v1/users/{userId}/password',
      path: {
        userId: userId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
