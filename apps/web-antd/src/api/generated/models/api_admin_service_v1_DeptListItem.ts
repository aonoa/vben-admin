/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type api_admin_service_v1_DeptListItem = {
  id?: string;
  pid?: string;
  name?: string;
  orderNo?: number;
  remark?: string;
  status?: number;
  createTime?: string;
  dom?: string;
  children?: Array<api_admin_service_v1_DeptListItem>;
};
