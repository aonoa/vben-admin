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
      fieldName: 'description',
      label: '描述',
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
      label: '方法',
    },
    {
      component: 'Input',
      componentProps: {
        class: 'w-full',
        allowClear: true,
      },
      formItemClass: 'col-span-2',
      fieldName: 'resources_group',
      label: '资源组',
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

export const gridSchemas: VxeGridProps<any> = {
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
    { field: 'description', title: '描述' },
    { field: 'module', title: '所属模块' },
    { field: 'module_description', title: '模块描述' },
    { field: 'path', title: '路径' },
    { field: 'method', title: '方法' },
    { field: 'resources_group', title: '资源组' },
    {
      field: 'action',
      width: 200,
      title: '操作',
      align: 'center',
      slots: { default: 'action' },
      fixed: 'right',
    },
  ],
  showOverflow: false,
};

export const formSchemas: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-5',
      fieldName: 'description',
      label: '描述',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-5',
      fieldName: 'module',
      label: '所属模块',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-5',
      fieldName: 'module_description',
      label: '模块描述',
    },
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'ApiSelect',
      // 对应组件的参数
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
            label: `${item.method}  ${item.url}`,
            value: `${item.method}:${item.url}`,
          }));
        },
        // 菜单接口
        api: GetWalkRoute,
      },
      formItemClass: 'col-span-5',
      fieldName: 'path',
      label: '路径',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-5',
      fieldName: 'resources_group',
      label: '资源组',
      rules: 'required',
    },
  ],
  showDefaultActions: false,
  // 一共三列
  wrapperClass: 'grid-cols-6',
};
