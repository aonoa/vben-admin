/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_common_service_v1_CopilotReply } from '../models/api_common_service_v1_CopilotReply';
import type { api_common_service_v1_Msg } from '../models/api_common_service_v1_Msg';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SseServiceService {
  /**
   * @returns api_common_service_v1_CopilotReply OK
   * @throws ApiError
   */
  public static sseServiceCopilot({
    requestBody,
  }: {
    requestBody: api_common_service_v1_Msg;
  }): CancelablePromise<api_common_service_v1_CopilotReply> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/common-api/v1/copilot/sse',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
