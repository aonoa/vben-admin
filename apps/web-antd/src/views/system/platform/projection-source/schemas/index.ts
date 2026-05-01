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
    { field: 'sourceService', title: '来源服务' },
    { field: 'domainCode', title: '业务域编码' },
    { field: 'syncMode', title: '同步模式' },
    { field: 'state', title: '状态' },
    { field: 'lastSnapshotRevision', title: '快照版本' },
    { field: 'lastSyncTime', title: '最近同步时间', width: 180 },
    { field: 'lastError', title: '最近错误' },
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
        placeholder: '请输入来源服务',
      },
      formItemClass: 'col-span-5',
      fieldName: 'sourceService',
      label: '来源服务',
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
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入同步模式',
      },
      formItemClass: 'col-span-5',
      fieldName: 'syncMode',
      label: '同步模式',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入状态',
      },
      formItemClass: 'col-span-5',
      fieldName: 'state',
      label: '状态',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入快照版本',
      },
      formItemClass: 'col-span-5',
      fieldName: 'lastSnapshotRevision',
      label: '快照版本',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入最近同步时间',
      },
      formItemClass: 'col-span-5',
      fieldName: 'lastSyncTime',
      label: '最近同步时间',
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入最近错误',
        rows: 3,
      },
      formItemClass: 'col-span-5',
      fieldName: 'lastError',
      label: '最近错误',
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
