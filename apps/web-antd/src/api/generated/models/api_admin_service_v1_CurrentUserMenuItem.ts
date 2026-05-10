/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_admin_service_v1_Meta } from './api_admin_service_v1_Meta';
export type api_admin_service_v1_CurrentUserMenuItem = {
  id?: number;
  component?: string;
  status?: number;
  authCode?: string;
  name?: string;
  path?: string;
  pid?: string;
  redirect?: string;
  type?: string;
  meta?: api_admin_service_v1_Meta;
  children?: Array<api_admin_service_v1_CurrentUserMenuItem>;
  createTime?: string;
};
