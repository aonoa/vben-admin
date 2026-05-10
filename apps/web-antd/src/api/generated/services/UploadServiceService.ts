/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_common_service_v1_File } from '../models/api_common_service_v1_File';
import type { api_common_service_v1_UploadResponse } from '../models/api_common_service_v1_UploadResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadServiceService {
  /**
   * @returns api_common_service_v1_UploadResponse OK
   * @throws ApiError
   */
  public static uploadServiceUploadFile({
    requestBody,
  }: {
    requestBody: api_common_service_v1_File;
  }): CancelablePromise<api_common_service_v1_UploadResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/common-api/v1/file/upload',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
