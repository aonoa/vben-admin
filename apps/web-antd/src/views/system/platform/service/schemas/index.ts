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
    { field: 'serviceCode', title: '服务编码' },
    { field: 'serviceName', title: '服务名称' },
    { field: 'domainCode', title: '业务域编码' },
    { field: 'httpPrefix', title: 'HTTP 前缀' },
    { field: 'grpcService', title: 'gRPC 服务' },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: '状态',
      width: 100,
    },
    {
      field: 'projectionEnabled',
      formatter: ({ cellValue }) => (cellValue ? '开启' : '关闭'),
      title: '投影启用',
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
        placeholder: '请输入服务编码',
      },
      formItemClass: 'col-span-5',
      fieldName: 'serviceCode',
      label: '服务编码',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入服务名称',
      },
      formItemClass: 'col-span-5',
      fieldName: 'serviceName',
      label: '服务名称',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务域编码',
      },
      formItemClass: 'col-span-5',
      fieldName: 'domainCode',
      label: '业务域编码',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入 HTTP 前缀',
      },
      formItemClass: 'col-span-5',
      fieldName: 'httpPrefix',
      label: 'HTTP 前缀',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入 gRPC 服务名',
      },
      formItemClass: 'col-span-5',
      fieldName: 'grpcService',
      label: 'gRPC 服务',
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
      component: 'Switch',
      componentProps: {
        checkedChildren: '开',
        unCheckedChildren: '关',
      },
      defaultValue: true,
      formItemClass: 'col-span-5',
      fieldName: 'projectionEnabled',
      label: '投影启用',
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
  ],
  showDefaultActions: false,
  wrapperClass: 'grid-cols-6',
};
