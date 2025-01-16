import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function uploadFileApi(data: any) {
  return requestClient.upload('/v1/server/file/upload', data);
}
