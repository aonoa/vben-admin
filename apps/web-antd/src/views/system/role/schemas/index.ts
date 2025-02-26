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
    { type: 'checkbox', width: 60 },
    { field: 'id', title: 'ID' },
    { field: 'roleName', title: '角色名' },
    { field: 'roleValue', title: '角色值' },
    { field: 'orderNo', title: '排序' },
    { field: 'createTime', title: '创建时间' },
    { field: 'remark', title: '备注' },
    {
      field: 'action',
      width: 200,
      title: '操作',
      align: 'center',
      slots: { default: 'action' },
      fixed: 'right',
    },
  ],
};

export const formSchemas: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-8',
      fieldName: 'account',
      label: '账号',
      rules: 'required',
    },
  ],
  showDefaultActions: false,
};
