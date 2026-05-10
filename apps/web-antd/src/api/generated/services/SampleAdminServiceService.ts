/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_sample_service_v1_CreateSampleItemRequest } from '../models/api_sample_service_v1_CreateSampleItemRequest';
import type { api_sample_service_v1_GetSampleItemListReply } from '../models/api_sample_service_v1_GetSampleItemListReply';
import type { api_sample_service_v1_GetSampleItemManageListReply } from '../models/api_sample_service_v1_GetSampleItemManageListReply';
import type { api_sample_service_v1_SampleItem } from '../models/api_sample_service_v1_SampleItem';
import type { api_sample_service_v1_UpdateSampleItemRequest } from '../models/api_sample_service_v1_UpdateSampleItemRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SampleAdminServiceService {
  /**
   * @returns api_sample_service_v1_GetSampleItemManageListReply OK
   * @throws ApiError
   */
  public static sampleAdminServiceGetSampleItemManageList(): CancelablePromise<api_sample_service_v1_GetSampleItemManageListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/sample-api/v1/admin/items',
    });
  }
  /**
   * @returns api_sample_service_v1_SampleItem OK
   * @throws ApiError
   */
  public static sampleAdminServiceCreateSampleItem({
    requestBody,
  }: {
    requestBody: api_sample_service_v1_CreateSampleItemRequest;
  }): CancelablePromise<api_sample_service_v1_SampleItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/sample-api/v1/admin/items',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_sample_service_v1_SampleItem OK
   * @throws ApiError
   */
  public static sampleAdminServiceUpdateSampleItem({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_sample_service_v1_UpdateSampleItemRequest;
  }): CancelablePromise<api_sample_service_v1_SampleItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/sample-api/v1/admin/items/{id}',
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
  public static sampleAdminServiceDeleteSampleItem({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/sample-api/v1/admin/items/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns api_sample_service_v1_GetSampleItemListReply OK
   * @throws ApiError
   */
  public static sampleAdminServiceGetSampleItemList(): CancelablePromise<api_sample_service_v1_GetSampleItemListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/sample-api/v1/items',
    });
  }
  /**
   * @returns api_sample_service_v1_SampleItem OK
   * @throws ApiError
   */
  public static sampleAdminServiceGetSampleItemInfo({
    id,
  }: {
    id: string;
  }): CancelablePromise<api_sample_service_v1_SampleItem> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/sample-api/v1/items/{id}',
      path: {
        id: id,
      },
    });
  }
}
