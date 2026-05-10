/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_auth_service_v1_GetAccessCodesReply } from '../models/api_auth_service_v1_GetAccessCodesReply';
import type { api_auth_service_v1_LoginReply } from '../models/api_auth_service_v1_LoginReply';
import type { api_auth_service_v1_LoginRequest } from '../models/api_auth_service_v1_LoginRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthServiceService {
  /**
   * @returns api_auth_service_v1_GetAccessCodesReply OK
   * @throws ApiError
   */
  public static authServiceGetAccessCodes(): CancelablePromise<api_auth_service_v1_GetAccessCodesReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/auth-api/v1/access-codes',
    });
  }
  /**
   * @returns api_auth_service_v1_LoginReply OK
   * @throws ApiError
   */
  public static authServiceLogin({
    requestBody,
  }: {
    requestBody: api_auth_service_v1_LoginRequest;
  }): CancelablePromise<api_auth_service_v1_LoginReply> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth-api/v1/login',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static authServiceLogout({
    requestBody,
  }: {
    requestBody: any;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth-api/v1/logout',
      body: requestBody,
    });
  }
  /**
   * @returns api_auth_service_v1_LoginReply OK
   * @throws ApiError
   */
  public static authServiceRefreshToken({
    requestBody,
  }: {
    requestBody: any;
  }): CancelablePromise<api_auth_service_v1_LoginReply> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth-api/v1/refresh',
      body: requestBody,
    });
  }
}
