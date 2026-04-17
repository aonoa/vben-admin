/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_base_api_v1_Meta } from './api_base_api_v1_Meta';
export type api_base_api_v1_SysMenuListItem = {
  id?: string;
  component?: string;
  status?: number;
  authCode?: string;
  name?: string;
  path?: string;
  pid?: string;
  redirect?: string;
  type?: string;
  meta?: api_base_api_v1_Meta;
  children?: Array<api_base_api_v1_SysMenuListItem>;
  createTime?: string;
};
