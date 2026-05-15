import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { z } from '#/adapter/form';

export const formOptions: VbenFormProps = {
  collapsed: false,
  compact: true,
  schema: [
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        class: 'w-full',
      },
      fieldName: 'name',
      formItemClass: 'col-span-2',
      label: '组织名称',
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        class: 'w-full',
      },
      fieldName: 'code',
      formItemClass: 'col-span-2',
      label: '组织编码',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 2 },
        ],
      },
      fieldName: 'status',
      formItemClass: 'col-span-2',
      label: '状态',
    },
  ],
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  submitOnChange: false,
  submitOnEnter: false,
  wrapperClass: 'grid-cols-6',
};

export const gridSchemas: VxeGridProps<any> = {
  columns: [
    { field: 'name', minWidth: 160, title: '组织名称' },
    { field: 'code', minWidth: 140, title: '组织编码' },
    { field: 'memberCount', title: '成员数', width: 100 },
    { field: 'deptCount', title: '部门数', width: 100 },
    { field: 'orderNo', title: '排序', width: 90 },
    {
      field: 'status',
      slots: { default: 'status' },
      title: '状态',
      width: 100,
    },
    { field: 'remark', minWidth: 180, title: '备注' },
    { field: 'createTime', minWidth: 170, title: '创建时间' },
    {
      align: 'center',
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 300,
    },
  ],
  height: 'auto',
  showOverflow: false,
  toolbarConfig: {
    custom: true,
    export: false,
    print: false,
    refresh: true,
  },
};

export const formSchemas: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入组织名称',
      },
      fieldName: 'name',
      formItemClass: 'col-span-5',
      label: '组织名称',
      rules: z
        .string()
        .min(1, '请输入组织名称')
        .max(50, '组织名称最多50个字符'),
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入组织编码',
      },
      fieldName: 'code',
      formItemClass: 'col-span-5',
      label: '组织编码',
      rules: z
        .string()
        .min(1, '请输入组织编码')
        .max(50, '组织编码最多50个字符')
        .regex(/^[\w-]+$/, '组织编码只能包含字母、数字、下划线和中划线'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 0,
        placeholder: '请输入排序',
      },
      defaultValue: 0,
      fieldName: 'orderNo',
      formItemClass: 'col-span-5',
      label: '排序',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        optionType: 'button',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
      defaultValue: 1,
      fieldName: 'status',
      formItemClass: 'col-span-5',
      label: '状态',
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 100,
        placeholder: '请输入备注',
        rows: 3,
        showCount: true,
      },
      fieldName: 'remark',
      formItemClass: 'col-span-5',
      label: '备注',
      rules: z.string().max(100, '备注最多100个字符').optional(),
    },
  ],
  showDefaultActions: false,
  wrapperClass: 'grid-cols-6',
};
