/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_admin_service_v1_ResourceListItem } from './api_admin_service_v1_ResourceListItem';
import type { api_admin_service_v1_SysMenuListItem } from './api_admin_service_v1_SysMenuListItem';
export type api_admin_service_v1_OrganizationPermissionCatalogReply = {
  organizationId?: string;
  menus?: Array<api_admin_service_v1_SysMenuListItem>;
  resources?: Array<api_admin_service_v1_ResourceListItem>;
  scopedMenuIds?: Array<number>;
  scopedResourceIds?: Array<string>;
};
