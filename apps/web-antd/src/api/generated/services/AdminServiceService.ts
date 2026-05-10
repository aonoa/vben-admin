/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_admin_service_v1_ApiListItem } from '../models/api_admin_service_v1_ApiListItem';
import type { api_admin_service_v1_BusinessDomainItem } from '../models/api_admin_service_v1_BusinessDomainItem';
import type { api_admin_service_v1_DeptListItem } from '../models/api_admin_service_v1_DeptListItem';
import type { api_admin_service_v1_GetApiListByPageReply } from '../models/api_admin_service_v1_GetApiListByPageReply';
import type { api_admin_service_v1_GetBusinessDomainListReply } from '../models/api_admin_service_v1_GetBusinessDomainListReply';
import type { api_admin_service_v1_GetCurrentUserMenusReply } from '../models/api_admin_service_v1_GetCurrentUserMenusReply';
import type { api_admin_service_v1_GetDeptListReply } from '../models/api_admin_service_v1_GetDeptListReply';
import type { api_admin_service_v1_GetProjectionSourceStatusListReply } from '../models/api_admin_service_v1_GetProjectionSourceStatusListReply';
import type { api_admin_service_v1_GetResourceListByPageReply } from '../models/api_admin_service_v1_GetResourceListByPageReply';
import type { api_admin_service_v1_GetRoleListByPageReply } from '../models/api_admin_service_v1_GetRoleListByPageReply';
import type { api_admin_service_v1_GetServiceRegistryListReply } from '../models/api_admin_service_v1_GetServiceRegistryListReply';
import type { api_admin_service_v1_GetSysLogInfoReply } from '../models/api_admin_service_v1_GetSysLogInfoReply';
import type { api_admin_service_v1_GetSysLogListReply } from '../models/api_admin_service_v1_GetSysLogListReply';
import type { api_admin_service_v1_GetSysMenuListReply } from '../models/api_admin_service_v1_GetSysMenuListReply';
import type { api_admin_service_v1_GetWalkRouteReply } from '../models/api_admin_service_v1_GetWalkRouteReply';
import type { api_admin_service_v1_IsMenuNameExistsReply } from '../models/api_admin_service_v1_IsMenuNameExistsReply';
import type { api_admin_service_v1_IsMenuPathExistsReply } from '../models/api_admin_service_v1_IsMenuPathExistsReply';
import type { api_admin_service_v1_ListUserRoleBindingsReply } from '../models/api_admin_service_v1_ListUserRoleBindingsReply';
import type { api_admin_service_v1_ProjectionSourceStatusItem } from '../models/api_admin_service_v1_ProjectionSourceStatusItem';
import type { api_admin_service_v1_ResourceListItem } from '../models/api_admin_service_v1_ResourceListItem';
import type { api_admin_service_v1_RoleListItem } from '../models/api_admin_service_v1_RoleListItem';
import type { api_admin_service_v1_ServiceRegistryItem } from '../models/api_admin_service_v1_ServiceRegistryItem';
import type { api_admin_service_v1_SysMenuListItem } from '../models/api_admin_service_v1_SysMenuListItem';
import type { api_admin_service_v1_UserRoleBindingItem } from '../models/api_admin_service_v1_UserRoleBindingItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminServiceService {
  /**
   * @returns api_admin_service_v1_GetApiListByPageReply OK
   * @throws ApiError
   */
  public static adminServiceGetApiList({
    currentPage,
    pageSize,
    path,
    description,
    method,
    resourcesGroup,
    serviceCode,
    domainCode,
  }: {
    currentPage?: string;
    pageSize?: string;
    path?: string;
    description?: string;
    method?: string;
    resourcesGroup?: string;
    serviceCode?: string;
    domainCode?: string;
  }): CancelablePromise<api_admin_service_v1_GetApiListByPageReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/apis',
      query: {
        currentPage: currentPage,
        pageSize: pageSize,
        path: path,
        description: description,
        method: method,
        resourcesGroup: resourcesGroup,
        serviceCode: serviceCode,
        domainCode: domainCode,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_ApiListItem OK
   * @throws ApiError
   */
  public static adminServiceAddApi({
    requestBody,
  }: {
    requestBody: api_admin_service_v1_ApiListItem;
  }): CancelablePromise<api_admin_service_v1_ApiListItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin-api/v1/apis',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_admin_service_v1_ApiListItem OK
   * @throws ApiError
   */
  public static adminServiceUpdateApi({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_admin_service_v1_ApiListItem;
  }): CancelablePromise<api_admin_service_v1_ApiListItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin-api/v1/apis/{id}',
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
  public static adminServiceDelApi({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin-api/v1/apis/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_GetDeptListReply OK
   * @throws ApiError
   */
  public static adminServiceGetDeptList(): CancelablePromise<api_admin_service_v1_GetDeptListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/depts',
    });
  }
  /**
   * @returns api_admin_service_v1_DeptListItem OK
   * @throws ApiError
   */
  public static adminServiceAddDept({
    requestBody,
  }: {
    requestBody: api_admin_service_v1_DeptListItem;
  }): CancelablePromise<api_admin_service_v1_DeptListItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin-api/v1/depts',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_admin_service_v1_DeptListItem OK
   * @throws ApiError
   */
  public static adminServiceUpdateDept({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_admin_service_v1_DeptListItem;
  }): CancelablePromise<api_admin_service_v1_DeptListItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin-api/v1/depts/{id}',
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
  public static adminServiceDelDept({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin-api/v1/depts/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_GetSysLogListReply OK
   * @throws ApiError
   */
  public static adminServiceGetSysLogList({
    currentPage,
    pageSize,
    userId,
    userName,
    isLogin,
    sessionId,
    method,
    path,
    requestTimeStart,
    requestTimeEnd,
    ipAddress,
    latency,
    resCode,
    resStatus,
  }: {
    currentPage?: string;
    pageSize?: string;
    userId?: string;
    userName?: string;
    isLogin?: boolean;
    sessionId?: string;
    method?: string;
    path?: string;
    requestTimeStart?: string;
    requestTimeEnd?: string;
    ipAddress?: string;
    latency?: string;
    resCode?: number;
    resStatus?: boolean;
  }): CancelablePromise<api_admin_service_v1_GetSysLogListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/logs',
      query: {
        currentPage: currentPage,
        pageSize: pageSize,
        userId: userId,
        userName: userName,
        isLogin: isLogin,
        sessionId: sessionId,
        method: method,
        path: path,
        requestTimeStart: requestTimeStart,
        requestTimeEnd: requestTimeEnd,
        ipAddress: ipAddress,
        latency: latency,
        resCode: resCode,
        resStatus: resStatus,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_GetSysLogInfoReply OK
   * @throws ApiError
   */
  public static adminServiceGetSysLogInfo({
    id,
  }: {
    id: string;
  }): CancelablePromise<api_admin_service_v1_GetSysLogInfoReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/logs/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_GetSysMenuListReply OK
   * @throws ApiError
   */
  public static adminServiceGetSysMenuList({
    menuName,
    status,
  }: {
    menuName?: string;
    status?: string;
  }): CancelablePromise<api_admin_service_v1_GetSysMenuListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/menus',
      query: {
        menuName: menuName,
        status: status,
      },
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static adminServiceCreateMenu({
    requestBody,
  }: {
    requestBody: api_admin_service_v1_SysMenuListItem;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin-api/v1/menus',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_admin_service_v1_GetCurrentUserMenusReply OK
   * @throws ApiError
   */
  public static adminServiceGetCurrentUserMenus(): CancelablePromise<api_admin_service_v1_GetCurrentUserMenusReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/menus/current',
    });
  }
  /**
   * @returns api_admin_service_v1_IsMenuNameExistsReply OK
   * @throws ApiError
   */
  public static adminServiceIsMenuNameExists({
    id,
    name,
  }: {
    id?: string;
    name?: string;
  }): CancelablePromise<api_admin_service_v1_IsMenuNameExistsReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/menus/name-exists',
      query: {
        id: id,
        name: name,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_IsMenuPathExistsReply OK
   * @throws ApiError
   */
  public static adminServiceIsMenuPathExists({
    id,
    path,
  }: {
    id?: string;
    path?: string;
  }): CancelablePromise<api_admin_service_v1_IsMenuPathExistsReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/menus/path-exists',
      query: {
        id: id,
        path: path,
      },
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static adminServiceUpdateMenu({
    id,
    requestBody,
  }: {
    id: number;
    requestBody: api_admin_service_v1_SysMenuListItem;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin-api/v1/menus/{id}',
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
  public static adminServiceDeleteMenu({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin-api/v1/menus/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_GetBusinessDomainListReply OK
   * @throws ApiError
   */
  public static adminServiceGetBusinessDomainList(): CancelablePromise<api_admin_service_v1_GetBusinessDomainListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/platform/domains',
    });
  }
  /**
   * @returns api_admin_service_v1_BusinessDomainItem OK
   * @throws ApiError
   */
  public static adminServiceAddBusinessDomain({
    requestBody,
  }: {
    requestBody: api_admin_service_v1_BusinessDomainItem;
  }): CancelablePromise<api_admin_service_v1_BusinessDomainItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin-api/v1/platform/domains',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_admin_service_v1_BusinessDomainItem OK
   * @throws ApiError
   */
  public static adminServiceUpdateBusinessDomain({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_admin_service_v1_BusinessDomainItem;
  }): CancelablePromise<api_admin_service_v1_BusinessDomainItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin-api/v1/platform/domains/{id}',
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
  public static adminServiceDeleteBusinessDomain({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin-api/v1/platform/domains/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_GetProjectionSourceStatusListReply OK
   * @throws ApiError
   */
  public static adminServiceGetProjectionSourceStatusList(): CancelablePromise<api_admin_service_v1_GetProjectionSourceStatusListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/platform/projection-sources',
    });
  }
  /**
   * @returns api_admin_service_v1_ProjectionSourceStatusItem OK
   * @throws ApiError
   */
  public static adminServiceAddProjectionSourceStatus({
    requestBody,
  }: {
    requestBody: api_admin_service_v1_ProjectionSourceStatusItem;
  }): CancelablePromise<api_admin_service_v1_ProjectionSourceStatusItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin-api/v1/platform/projection-sources',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_admin_service_v1_ProjectionSourceStatusItem OK
   * @throws ApiError
   */
  public static adminServiceReportProjectionSourceStatus({
    sourceService,
    requestBody,
  }: {
    sourceService: string;
    requestBody: api_admin_service_v1_ProjectionSourceStatusItem;
  }): CancelablePromise<api_admin_service_v1_ProjectionSourceStatusItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin-api/v1/platform/projection-sources/report/{sourceService}',
      path: {
        sourceService: sourceService,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_admin_service_v1_ProjectionSourceStatusItem OK
   * @throws ApiError
   */
  public static adminServiceUpdateProjectionSourceStatus({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_admin_service_v1_ProjectionSourceStatusItem;
  }): CancelablePromise<api_admin_service_v1_ProjectionSourceStatusItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin-api/v1/platform/projection-sources/{id}',
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
  public static adminServiceDeleteProjectionSourceStatus({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin-api/v1/platform/projection-sources/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_GetServiceRegistryListReply OK
   * @throws ApiError
   */
  public static adminServiceGetServiceRegistryList(): CancelablePromise<api_admin_service_v1_GetServiceRegistryListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/platform/services',
    });
  }
  /**
   * @returns api_admin_service_v1_ServiceRegistryItem OK
   * @throws ApiError
   */
  public static adminServiceAddServiceRegistry({
    requestBody,
  }: {
    requestBody: api_admin_service_v1_ServiceRegistryItem;
  }): CancelablePromise<api_admin_service_v1_ServiceRegistryItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin-api/v1/platform/services',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_admin_service_v1_ServiceRegistryItem OK
   * @throws ApiError
   */
  public static adminServiceUpdateServiceRegistry({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_admin_service_v1_ServiceRegistryItem;
  }): CancelablePromise<api_admin_service_v1_ServiceRegistryItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin-api/v1/platform/services/{id}',
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
  public static adminServiceDeleteServiceRegistry({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin-api/v1/platform/services/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_GetResourceListByPageReply OK
   * @throws ApiError
   */
  public static adminServiceGetResourceList({
    currentPage,
    pageSize,
    name,
    type,
    value,
    method,
    description,
  }: {
    currentPage?: string;
    pageSize?: string;
    name?: string;
    type?: string;
    value?: string;
    method?: string;
    description?: string;
  }): CancelablePromise<api_admin_service_v1_GetResourceListByPageReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/resources',
      query: {
        currentPage: currentPage,
        pageSize: pageSize,
        name: name,
        type: type,
        value: value,
        method: method,
        description: description,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_ResourceListItem OK
   * @throws ApiError
   */
  public static adminServiceAddResource({
    requestBody,
  }: {
    requestBody: api_admin_service_v1_ResourceListItem;
  }): CancelablePromise<api_admin_service_v1_ResourceListItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin-api/v1/resources',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_admin_service_v1_ResourceListItem OK
   * @throws ApiError
   */
  public static adminServiceUpdateResource({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_admin_service_v1_ResourceListItem;
  }): CancelablePromise<api_admin_service_v1_ResourceListItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin-api/v1/resources/{id}',
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
  public static adminServiceDelResource({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin-api/v1/resources/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_GetRoleListByPageReply OK
   * @throws ApiError
   */
  public static adminServiceGetRoleList({
    currentPage,
    pageSize,
    name,
    status,
    deptId,
  }: {
    currentPage?: string;
    pageSize?: string;
    name?: string;
    status?: string;
    deptId?: string;
  }): CancelablePromise<api_admin_service_v1_GetRoleListByPageReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/roles',
      query: {
        currentPage: currentPage,
        pageSize: pageSize,
        name: name,
        status: status,
        deptId: deptId,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_RoleListItem OK
   * @throws ApiError
   */
  public static adminServiceAddRole({
    requestBody,
  }: {
    requestBody: api_admin_service_v1_RoleListItem;
  }): CancelablePromise<api_admin_service_v1_RoleListItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin-api/v1/roles',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns api_admin_service_v1_RoleListItem OK
   * @throws ApiError
   */
  public static adminServiceUpdateRole({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_admin_service_v1_RoleListItem;
  }): CancelablePromise<api_admin_service_v1_RoleListItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin-api/v1/roles/{id}',
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
  public static adminServiceDelRole({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin-api/v1/roles/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_ListUserRoleBindingsReply OK
   * @throws ApiError
   */
  public static adminServiceListUserRoleBindings(): CancelablePromise<api_admin_service_v1_ListUserRoleBindingsReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/user-role-bindings',
    });
  }
  /**
   * @returns api_admin_service_v1_UserRoleBindingItem OK
   * @throws ApiError
   */
  public static adminServiceGetUserRoleBinding({
    userId,
  }: {
    userId: string;
  }): CancelablePromise<api_admin_service_v1_UserRoleBindingItem> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/user-role-bindings/{userId}',
      path: {
        userId: userId,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_UserRoleBindingItem OK
   * @throws ApiError
   */
  public static adminServiceUpsertUserRoleBinding({
    userId,
    requestBody,
  }: {
    userId: string;
    requestBody: api_admin_service_v1_UserRoleBindingItem;
  }): CancelablePromise<api_admin_service_v1_UserRoleBindingItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin-api/v1/user-role-bindings/{userId}',
      path: {
        userId: userId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static adminServiceDeleteUserRoleBinding({
    userId,
  }: {
    userId: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin-api/v1/user-role-bindings/{userId}',
      path: {
        userId: userId,
      },
    });
  }
  /**
   * @returns api_admin_service_v1_GetWalkRouteReply OK
   * @throws ApiError
   */
  public static adminServiceGetWalkRoute(): CancelablePromise<api_admin_service_v1_GetWalkRouteReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-api/v1/walk-routes',
    });
  }
}
