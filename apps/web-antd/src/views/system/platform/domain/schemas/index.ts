import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const gridSchemas: VxeGridProps<any> = {
  checkboxConfig: {
    highlight: true,
  },
  toolbarConfig: {
    refresh: true,
    print: false,
    export: false,
    custom: true,
  },
  height: 'auto',
  columns: [
    { field: 'id', width: 60, visible: false },
    { field: 'code', title: '业务域编码' },
    { field: 'name', title: '业务域名称' },
    { field: 'ownerService', title: '主责服务' },
    { field: 'orgModelType', title: '组织模型' },
    { field: 'authScopeType', title: '权限范围' },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: '状态',
      width: 100,
    },
    { field: 'description', title: '描述' },
    { field: 'createTime', title: '创建时间', width: 180 },
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
        placeholder: '请输入业务域编码',
      },
      formItemClass: 'col-span-5',
      fieldName: 'code',
      label: '业务域编码',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务域名称',
      },
      formItemClass: 'col-span-5',
      fieldName: 'name',
      label: '业务域名称',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入主责服务',
      },
      formItemClass: 'col-span-5',
      fieldName: 'ownerService',
      label: '主责服务',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入组织模型类型',
      },
      formItemClass: 'col-span-5',
      fieldName: 'orgModelType',
      label: '组织模型',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入权限范围类型',
      },
      formItemClass: 'col-span-5',
      fieldName: 'authScopeType',
      label: '权限范围',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          {
            label: '启用',
            value: 1,
          },
          {
            label: '禁用',
            value: 0,
          },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      formItemClass: 'col-span-5',
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入描述',
        rows: 3,
      },
      formItemClass: 'col-span-5',
      fieldName: 'description',
      label: '描述',
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入元数据 JSON',
        rows: 4,
      },
      formItemClass: 'col-span-5',
      fieldName: 'metaJson',
      label: '元数据',
    },
  ],
  showDefaultActions: false,
  wrapperClass: 'grid-cols-6',
};
