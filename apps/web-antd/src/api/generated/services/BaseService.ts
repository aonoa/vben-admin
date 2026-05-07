/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { api_base_api_v1_ApiListItem } from '../models/api_base_api_v1_ApiListItem';
import type { api_base_api_v1_ChangePasswordRequest } from '../models/api_base_api_v1_ChangePasswordRequest';
import type { api_base_api_v1_CreateSiteMessageReply } from '../models/api_base_api_v1_CreateSiteMessageReply';
import type { api_base_api_v1_CreateSiteMessageRequest } from '../models/api_base_api_v1_CreateSiteMessageRequest';
import type { api_base_api_v1_DeptListItem } from '../models/api_base_api_v1_DeptListItem';
import type { api_base_api_v1_GetAccessCodesReply } from '../models/api_base_api_v1_GetAccessCodesReply';
import type { api_base_api_v1_GetApiListByPageReply } from '../models/api_base_api_v1_GetApiListByPageReply';
import type { api_base_api_v1_GetDeptListReply } from '../models/api_base_api_v1_GetDeptListReply';
import type { api_base_api_v1_GetMySiteMessageListReply } from '../models/api_base_api_v1_GetMySiteMessageListReply';
import type { api_base_api_v1_GetMySiteMessageUnreadCountReply } from '../models/api_base_api_v1_GetMySiteMessageUnreadCountReply';
import type { api_base_api_v1_GetPublishedSiteMessageListReply } from '../models/api_base_api_v1_GetPublishedSiteMessageListReply';
import type { api_base_api_v1_GetResourceListByPageReply } from '../models/api_base_api_v1_GetResourceListByPageReply';
import type { api_base_api_v1_GetRoleListByPageReply } from '../models/api_base_api_v1_GetRoleListByPageReply';
import type { api_base_api_v1_GetSysLogInfoReply } from '../models/api_base_api_v1_GetSysLogInfoReply';
import type { api_base_api_v1_GetSysLogListReply } from '../models/api_base_api_v1_GetSysLogListReply';
import type { api_base_api_v1_GetSysMenuListReply } from '../models/api_base_api_v1_GetSysMenuListReply';
import type { api_base_api_v1_GetUserInfoReply } from '../models/api_base_api_v1_GetUserInfoReply';
import type { api_base_api_v1_GetUserListReply } from '../models/api_base_api_v1_GetUserListReply';
import type { api_base_api_v1_GetWalkRouteReply } from '../models/api_base_api_v1_GetWalkRouteReply';
import type { api_base_api_v1_IsMenuNameExistsReply } from '../models/api_base_api_v1_IsMenuNameExistsReply';
import type { api_base_api_v1_IsMenuPathExistsReply } from '../models/api_base_api_v1_IsMenuPathExistsReply';
import type { api_base_api_v1_IsUserExistsReply } from '../models/api_base_api_v1_IsUserExistsReply';
import type { api_base_api_v1_IsUserExistsRequest } from '../models/api_base_api_v1_IsUserExistsRequest';
import type { api_base_api_v1_LoginReply } from '../models/api_base_api_v1_LoginReply';
import type { api_base_api_v1_LoginRequest } from '../models/api_base_api_v1_LoginRequest';
import type { api_base_api_v1_MarkAllSiteMessagesReadReply } from '../models/api_base_api_v1_MarkAllSiteMessagesReadReply';
import type { api_base_api_v1_MarkSiteMessageReadRequest } from '../models/api_base_api_v1_MarkSiteMessageReadRequest';
import type { api_base_api_v1_RecallSiteMessageRequest } from '../models/api_base_api_v1_RecallSiteMessageRequest';
import type { api_base_api_v1_ResourceListItem } from '../models/api_base_api_v1_ResourceListItem';
import type { api_base_api_v1_RoleListItem } from '../models/api_base_api_v1_RoleListItem';
import type { api_base_api_v1_SetRoleStatusRequest } from '../models/api_base_api_v1_SetRoleStatusRequest';
import type { api_base_api_v1_SysMenuListItem } from '../models/api_base_api_v1_SysMenuListItem';
import type { api_base_api_v1_UserListItem } from '../models/api_base_api_v1_UserListItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BaseService {
  /**
   * 获取权限code
   * @returns api_base_api_v1_GetAccessCodesReply OK
   * @throws ApiError
   */
  public static baseGetAccessCodes(): CancelablePromise<api_base_api_v1_GetAccessCodesReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/auth/codes',
    });
  }
  /**
   * 用户登陆
   * @returns api_base_api_v1_LoginReply OK
   * @throws ApiError
   */
  public static baseLogin({
    requestBody,
  }: {
    requestBody: api_base_api_v1_LoginRequest;
  }): CancelablePromise<api_base_api_v1_LoginReply> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/auth/login',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 注销登陆 (仅靠jwt无法实现退出功能)(未实现，主要靠前端删凭证)
   * @returns any OK
   * @throws ApiError
   */
  public static baseLogout({
    requestBody,
  }: {
    requestBody: any;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/auth/logout',
      body: requestBody,
    });
  }
  /**
   * 使用refreshToken换取accessToken
   * @returns api_base_api_v1_LoginReply OK
   * @throws ApiError
   */
  public static baseRefreshToken({
    requestBody,
  }: {
    requestBody: any;
  }): CancelablePromise<api_base_api_v1_LoginReply> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/auth/refresh',
      body: requestBody,
    });
  }
  /**
   * ////////////////////////////////////////////////// (重新加载casbin权限数据)
   * @returns any OK
   * @throws ApiError
   */
  public static baseReLoadPolicy({
    requestBody,
  }: {
    requestBody: any;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/auth/reloadPolicy',
      body: requestBody,
    });
  }
  /**
   * 获取路由菜单列表
   * rpc GetMenuList (google.protobuf.Empty) returns (GetMenuListReply) {
   * @returns api_base_api_v1_GetSysMenuListReply OK
   * @throws ApiError
   */
  public static baseGetMenuList(): CancelablePromise<api_base_api_v1_GetSysMenuListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/menu/all',
    });
  }
  /**
   * 保存/定时/发布站内信
   * @returns api_base_api_v1_CreateSiteMessageReply OK
   * @throws ApiError
   */
  public static baseCreateSiteMessage({
    requestBody,
  }: {
    requestBody: api_base_api_v1_CreateSiteMessageRequest;
  }): CancelablePromise<api_base_api_v1_CreateSiteMessageReply> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/notice/admin',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 获取已发布站内信列表
   * @returns api_base_api_v1_GetPublishedSiteMessageListReply OK
   * @throws ApiError
   */
  public static baseGetPublishedSiteMessageList({
    currentPage,
    pageSize,
    status,
  }: {
    currentPage?: string;
    pageSize?: string;
    status?: string;
  }): CancelablePromise<api_base_api_v1_GetPublishedSiteMessageListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/notice/admin/list',
      query: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: status,
      },
    });
  }
  /**
   * 撤回已发布站内信
   * @returns any OK
   * @throws ApiError
   */
  public static baseRecallSiteMessage({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_base_api_v1_RecallSiteMessageRequest;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/notice/admin/recall/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 删除未发布站内信
   * @returns any OK
   * @throws ApiError
   */
  public static baseDeletePendingSiteMessage({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/basic-api/notice/admin/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * ////////////////////////////////////////////// 站内信
   * 获取当前用户站内信列表
   * @returns api_base_api_v1_GetMySiteMessageListReply OK
   * @throws ApiError
   */
  public static baseGetMySiteMessageList({
    currentPage,
    pageSize,
    readStatus,
  }: {
    currentPage?: string;
    pageSize?: string;
    readStatus?: number;
  }): CancelablePromise<api_base_api_v1_GetMySiteMessageListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/notice/my/list',
      query: {
        currentPage: currentPage,
        pageSize: pageSize,
        readStatus: readStatus,
      },
    });
  }
  /**
   * 标记全部站内信已读
   * @returns api_base_api_v1_MarkAllSiteMessagesReadReply OK
   * @throws ApiError
   */
  public static baseMarkAllSiteMessagesRead({
    requestBody,
  }: {
    requestBody: any;
  }): CancelablePromise<api_base_api_v1_MarkAllSiteMessagesReadReply> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/notice/my/read-all',
      body: requestBody,
    });
  }
  /**
   * 标记单条站内信已读
   * @returns any OK
   * @throws ApiError
   */
  public static baseMarkSiteMessageRead({
    messageId,
    requestBody,
  }: {
    messageId: string;
    requestBody: api_base_api_v1_MarkSiteMessageReadRequest;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/notice/my/read/{messageId}',
      path: {
        messageId: messageId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 获取当前用户未读站内信数量
   * @returns api_base_api_v1_GetMySiteMessageUnreadCountReply OK
   * @throws ApiError
   */
  public static baseGetMySiteMessageUnreadCount(): CancelablePromise<api_base_api_v1_GetMySiteMessageUnreadCountReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/notice/my/unread-count',
    });
  }
  /**
   * 标记单条站内信未读
   * @returns any OK
   * @throws ApiError
   */
  public static baseMarkSiteMessageUnread({
    messageId,
    requestBody,
  }: {
    messageId: string;
    requestBody: api_base_api_v1_MarkSiteMessageReadRequest;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/notice/my/unread/{messageId}',
      path: {
        messageId: messageId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 添加api资源
   * @returns api_base_api_v1_ApiListItem OK
   * @throws ApiError
   */
  public static baseAddApi({
    requestBody,
  }: {
    requestBody: api_base_api_v1_ApiListItem;
  }): CancelablePromise<api_base_api_v1_ApiListItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/system/api',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * //////////////////////////////// api资源管理
   * 获取api资源
   * @returns api_base_api_v1_GetApiListByPageReply OK
   * @throws ApiError
   */
  public static baseGetApiList({
    currentPage,
    pageSize,
    path,
    description,
    method,
    resourcesGroup,
  }: {
    currentPage?: string;
    pageSize?: string;
    path?: string;
    description?: string;
    method?: string;
    resourcesGroup?: string;
  }): CancelablePromise<api_base_api_v1_GetApiListByPageReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/system/api/list',
      query: {
        currentPage: currentPage,
        pageSize: pageSize,
        path: path,
        description: description,
        method: method,
        resourcesGroup: resourcesGroup,
      },
    });
  }
  /**
   * 修改api资源
   * @returns api_base_api_v1_ApiListItem OK
   * @throws ApiError
   */
  public static baseUpdateApi({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_base_api_v1_ApiListItem;
  }): CancelablePromise<api_base_api_v1_ApiListItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/basic-api/system/api/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 删除api资源
   * @returns any OK
   * @throws ApiError
   */
  public static baseDelApi({ id }: { id: string }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/basic-api/system/api/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * 改密码
   * @returns any OK
   * @throws ApiError
   */
  public static baseChangePassword({
    requestBody,
  }: {
    requestBody: api_base_api_v1_ChangePasswordRequest;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/system/changePassword',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 新增部门
   * @returns api_base_api_v1_DeptListItem OK
   * @throws ApiError
   */
  public static baseAddDept({
    requestBody,
  }: {
    requestBody: api_base_api_v1_DeptListItem;
  }): CancelablePromise<api_base_api_v1_DeptListItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/system/dept',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 获取部门列表
   * @returns api_base_api_v1_GetDeptListReply OK
   * @throws ApiError
   */
  public static baseGetDeptList(): CancelablePromise<api_base_api_v1_GetDeptListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/system/dept/list',
    });
  }
  /**
   * 修改部门
   * @returns api_base_api_v1_DeptListItem OK
   * @throws ApiError
   */
  public static baseUpdateDept({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_base_api_v1_DeptListItem;
  }): CancelablePromise<api_base_api_v1_DeptListItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/basic-api/system/dept/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 删除部门
   * @returns any OK
   * @throws ApiError
   */
  public static baseDelDept({ id }: { id: string }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/basic-api/system/dept/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * /////////////////////////////////////////////////
   * 获取系统所有 api
   * @returns api_base_api_v1_GetWalkRouteReply OK
   * @throws ApiError
   */
  public static baseGetWalkRoute(): CancelablePromise<api_base_api_v1_GetWalkRouteReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/system/getWalkRoute',
    });
  }
  /**
   * ////////////////////////////////////////////// 日志
   * 获取系统日志列表
   * @returns api_base_api_v1_GetSysLogListReply OK
   * @throws ApiError
   */
  public static baseGetSysLogList({
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
  }): CancelablePromise<api_base_api_v1_GetSysLogListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/system/log/list',
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
   * 获取单条日志详情
   * @returns api_base_api_v1_GetSysLogInfoReply OK
   * @throws ApiError
   */
  public static baseGetSysLogInfo({
    id,
  }: {
    id: string;
  }): CancelablePromise<api_base_api_v1_GetSysLogInfoReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/system/log/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * 创建菜单
   * @returns any OK
   * @throws ApiError
   */
  public static baseCreateMenu({
    requestBody,
  }: {
    requestBody: api_base_api_v1_SysMenuListItem;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/system/menu',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * /////////////////////////////////////////////////// 系统菜单管理
   * 获取菜单列表
   * @returns api_base_api_v1_GetSysMenuListReply OK
   * @throws ApiError
   */
  public static baseGetSysMenuList({
    menuName,
    status,
  }: {
    menuName?: string;
    status?: string;
  }): CancelablePromise<api_base_api_v1_GetSysMenuListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/system/menu/list',
      query: {
        menuName: menuName,
        status: status,
      },
    });
  }
  /**
   * 菜单名称是否存在
   * @returns api_base_api_v1_IsMenuNameExistsReply OK
   * @throws ApiError
   */
  public static baseIsMenuNameExists({
    id,
    name,
  }: {
    id?: string;
    name?: string;
  }): CancelablePromise<api_base_api_v1_IsMenuNameExistsReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/system/menu/name-exists',
      query: {
        id: id,
        name: name,
      },
    });
  }
  /**
   * 路由地址是否存在
   * @returns api_base_api_v1_IsMenuPathExistsReply OK
   * @throws ApiError
   */
  public static baseIsMenuPathExists({
    id,
    path,
  }: {
    id?: string;
    path?: string;
  }): CancelablePromise<api_base_api_v1_IsMenuPathExistsReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/system/menu/path-exists',
      query: {
        id: id,
        path: path,
      },
    });
  }
  /**
   * 更新菜单
   * @returns any OK
   * @throws ApiError
   */
  public static baseUpdateMenu({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_base_api_v1_SysMenuListItem;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/basic-api/system/menu/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 删除菜单
   * @returns any OK
   * @throws ApiError
   */
  public static baseDeleteMenu({ id }: { id: string }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/basic-api/system/menu/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * 添加resource资源
   * @returns api_base_api_v1_ResourceListItem OK
   * @throws ApiError
   */
  public static baseAddResource({
    requestBody,
  }: {
    requestBody: api_base_api_v1_ResourceListItem;
  }): CancelablePromise<api_base_api_v1_ResourceListItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/system/resource',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * //////////////////////////////// resource 资源管理
   * 获取resource资源
   * @returns api_base_api_v1_GetResourceListByPageReply OK
   * @throws ApiError
   */
  public static baseGetResourceList({
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
  }): CancelablePromise<api_base_api_v1_GetResourceListByPageReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/system/resource/list',
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
   * 修改resource资源
   * @returns api_base_api_v1_ResourceListItem OK
   * @throws ApiError
   */
  public static baseUpdateResource({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_base_api_v1_ResourceListItem;
  }): CancelablePromise<api_base_api_v1_ResourceListItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/basic-api/system/resource/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 删除resource资源
   * @returns any OK
   * @throws ApiError
   */
  public static baseDelResource({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/basic-api/system/resource/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * 新增角色
   * @returns api_base_api_v1_RoleListItem OK
   * @throws ApiError
   */
  public static baseAddRole({
    requestBody,
  }: {
    requestBody: api_base_api_v1_RoleListItem;
  }): CancelablePromise<api_base_api_v1_RoleListItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/system/role',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 获取角色列表
   * @returns api_base_api_v1_GetRoleListByPageReply OK
   * @throws ApiError
   */
  public static baseGetRoleList({
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
  }): CancelablePromise<api_base_api_v1_GetRoleListByPageReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/system/role/list',
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
   * 修改角色
   * @returns api_base_api_v1_RoleListItem OK
   * @throws ApiError
   */
  public static baseUpdateRole({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_base_api_v1_RoleListItem;
  }): CancelablePromise<api_base_api_v1_RoleListItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/basic-api/system/role/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 删除角色
   * @returns any OK
   * @throws ApiError
   */
  public static baseDelRole({ id }: { id: string }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/basic-api/system/role/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * 设置角色状态 (未使用)
   * @returns any OK
   * @throws ApiError
   */
  public static baseSetRoleStatus({
    requestBody,
  }: {
    requestBody: api_base_api_v1_SetRoleStatusRequest;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/system/setRoleStatus',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 新增用户
   * @returns api_base_api_v1_UserListItem OK
   * @throws ApiError
   */
  public static baseAddUser({
    requestBody,
  }: {
    requestBody: api_base_api_v1_UserListItem;
  }): CancelablePromise<api_base_api_v1_UserListItem> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/system/user',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 获取账户列表
   * @returns api_base_api_v1_GetUserListReply OK
   * @throws ApiError
   */
  public static baseGetUserList({
    currentPage,
    pageSize,
    username,
    nickname,
    deptId,
    role,
    status,
  }: {
    currentPage?: string;
    pageSize?: string;
    username?: string;
    nickname?: string;
    deptId?: string;
    role?: string;
    status?: number;
  }): CancelablePromise<api_base_api_v1_GetUserListReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/system/user/list',
      query: {
        currentPage: currentPage,
        pageSize: pageSize,
        username: username,
        nickname: nickname,
        deptId: deptId,
        role: role,
        status: status,
      },
    });
  }
  /**
   * 检查用户是否存在
   * @returns api_base_api_v1_IsUserExistsReply OK
   * @throws ApiError
   */
  public static baseIsUserExist({
    requestBody,
  }: {
    requestBody: api_base_api_v1_IsUserExistsRequest;
  }): CancelablePromise<api_base_api_v1_IsUserExistsReply> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/basic-api/system/user/user-exists',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 更新用户
   * @returns api_base_api_v1_UserListItem OK
   * @throws ApiError
   */
  public static baseUpdateUser({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: api_base_api_v1_UserListItem;
  }): CancelablePromise<api_base_api_v1_UserListItem> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/basic-api/system/user/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 删除用户
   * @returns any OK
   * @throws ApiError
   */
  public static baseDelUser({ id }: { id: string }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/basic-api/system/user/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * 获取用户信息
   * @returns api_base_api_v1_GetUserInfoReply OK
   * @throws ApiError
   */
  public static baseGetUserInfo(): CancelablePromise<api_base_api_v1_GetUserInfoReply> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/basic-api/user/info',
    });
  }
}
