import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { GetWalkRouteReply } from '#/api/system/api';

import { GetWalkRoute } from '#/api/system/api';

export const formOptions: VbenFormProps = {
  wrapperClass: 'grid-cols-9',
  compact: true,
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        class: 'w-full',
        allowClear: true,
      },
      formItemClass: 'col-span-2',
      fieldName: 'session_id',
      label: '会话ID',
    },
    {
      component: 'Input',
      componentProps: {
        class: 'w-full',
        allowClear: true,
      },
      formItemClass: 'col-span-2',
      fieldName: 'user_id',
      label: '操作人ID',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        class: 'w-full',
        allowClear: true,
        showSearch: true,
        filterOption: true,
        optionFilterProp: 'label',
        placeholder: '请选择',
        // 菜单接口转options格式
        afterFetch: (data: GetWalkRouteReply) => {
          return data?.items.map((item: any) => ({
            label: item.url,
            value: item.url,
          }));
        },
        // 菜单接口
        api: GetWalkRoute,
      },
      formItemClass: 'col-span-2',
      fieldName: 'path',
      label: '路径',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        allowClear: true,
        options: [
          {
            label: 'GET',
            value: 'GET',
          },
          {
            label: 'POST',
            value: 'POST',
          },
          {
            label: 'PUT',
            value: 'PUT',
          },
          {
            label: 'DELETE',
            value: 'DELETE',
          },
          {
            label: 'PATCH',
            value: 'PATCH',
          },
        ],
      },
      formItemClass: 'col-span-2',
      fieldName: 'method',
      label: '请求方式',
    },
    {
      component: 'Input',
      componentProps: {
        class: 'w-full',
        allowClear: true,
      },
      formItemClass: 'col-span-2',
      fieldName: 'ip_address',
      label: '访问IP',
    },
    {
      component: 'Input',
      componentProps: {
        class: 'w-full',
        allowClear: true,
      },
      formItemClass: 'col-span-2',
      fieldName: 'request_time',
      label: '操作时间',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        allowClear: true,
        options: [
          {
            label: '150ms内',
            value: 150,
          },
          {
            label: '500ms内',
            value: 500,
          },
          {
            label: '1s内',
            value: 1000,
          },
          {
            label: '大于1s',
            value: 1001,
          },
        ],
      },
      formItemClass: 'col-span-2',
      fieldName: 'latency',
      label: '请求耗时',
    },
  ],

  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

export const loginFormOptions: VbenFormProps = {
  wrapperClass: 'grid-cols-9',
  compact: true,
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        class: 'w-full',
        allowClear: true,
      },
      formItemClass: 'col-span-2',
      fieldName: 'user_name',
      label: '用户名',
    },
    {
      component: 'Input',
      componentProps: {
        class: 'w-full',
        allowClear: true,
      },
      formItemClass: 'col-span-2',
      fieldName: 'ip_address',
      label: 'IP地址',
    },
    {
      component: 'Input',
      componentProps: {
        class: 'w-full',
        allowClear: true,
      },
      formItemClass: 'col-span-2',
      fieldName: 'request_time',
      label: '登录时间',
    },
  ],

  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

export const systemGridSchemas: VxeGridProps<any> = {
  checkboxConfig: {
    highlight: true,
    // labelField: 'name',
  },
  toolbarConfig: {
    refresh: true, // 刷新
    print: false, // 打印
    export: false, // 导出
    custom: true, // 自定义列
    // zoom: true, // 最大化最小化
  },
  height: 'auto',
  columns: [
    { field: 'id', width: 60, visible: false },
    { field: 'user_id', title: '用户ID' },
    { field: 'method', title: '请求方式', width: 120 },
    { field: 'path', title: '请求路径' },
    { field: 'request_time', title: '请求时间', width: 180 },
    { field: 'ip_address', title: '访问IP', width: 180 },
    { field: 'latency', title: '处理耗时(ms)', width: 130 },
    { field: 'res_code', title: '状态码', width: 100 },
    { field: 'res_status', title: '响应状态', width: 120 },
    {
      field: 'action',
      width: 140,
      title: '操作',
      align: 'center',
      slots: { default: 'action' },
      fixed: 'right',
    },
  ],
  showOverflow: false,
};

export const loginGridSchemas: VxeGridProps<any> = {
  checkboxConfig: {
    highlight: true,
    // labelField: 'name',
  },
  toolbarConfig: {
    refresh: true, // 刷新
    print: false, // 打印
    export: false, // 导出
    custom: true, // 自定义列
    // zoom: true, // 最大化最小化
  },
  height: 'auto',
  columns: [
    { field: 'id', width: 60, visible: false },
    { field: 'user_name', title: '用户名' },
    { field: 'request_time', title: '请求时间' },
    { field: 'ip_address', title: '访问IP' },
    { field: 'ip_location', title: 'IP归属地' },
    { field: 'latency', title: '处理耗时(ms)' },
    { field: 'os', title: '操作系统' },
    { field: 'browser', title: '浏览器' },
    { field: 'res_code', title: '状态码' },
    { field: 'res_status', title: '响应状态' },
    {
      field: 'action',
      width: 120,
      title: '操作',
      align: 'center',
      slots: { default: 'action' },
      fixed: 'right',
    },
  ],
  showOverflow: false,
};
