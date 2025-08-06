import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

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
    { field: 'name', title: '资源名称' },
    { field: 'type', title: '资源类型' },
    { field: 'value', title: '资源值' },
    { field: 'method', title: '操作' },
    { field: 'description', title: '描述' },
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
      fieldName: 'name',
      label: '资源名称',
    },
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
      fieldName: 'type',
      label: '资源类型',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-5',
      fieldName: 'value',
      label: '资源值',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-5',
      fieldName: 'method',
      label: '资源的操作',
      rules: 'required',
    },
  ],
  showDefaultActions: false,
  // 一共三列
  wrapperClass: 'grid-cols-6',
};
