/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_base_api_v1_Msg } from '../models/api_base_api_v1_Msg';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SseServiceService {
  /**
   * AI智能助手
   * @returns any OK
   * @throws ApiError
   */
  public static sseServiceCopilot({
    requestBody,
  }: {
    requestBody: api_base_api_v1_Msg;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/v1/copilot/sse',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
