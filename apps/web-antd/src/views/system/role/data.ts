import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api';

import { getDeptList } from '#/api/system/dept';
import { $t } from '#/locales';

export function useFormSchema(organizationId?: () => string): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.role.roleName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'value',
      label: $t('system.role.value'),
      rules: 'required',
    },
    // {
    //   component: 'Select',
    //   componentProps: {
    //     class: 'w-4/5',
    //     options: [
    //       {
    //         label: '默认角色',
    //         value: 'default',
    //       },
    //       {
    //         label: '管理员',
    //         value: 'admin',
    //       },
    //       {
    //         label: '超级管理员',
    //         value: 'root',
    //       },
    //     ],
    //   },
    //   defaultValue: 'default',
    //   fieldName: 'value',
    //   label: $t('system.role.value'),
    //   rules: 'required',
    // },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.role.status'),
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        options: [
          { label: '全组织', value: 'all' },
          { label: '本部门', value: 'self_dept' },
          { label: '本部门及下级', value: 'self_dept_and_child' },
          { label: '仅本人', value: 'self' },
          { label: '指定部门集合', value: 'custom_depts' },
        ],
      },
      defaultValue: 'self',
      fieldName: 'data_scope',
      label: '数据范围',
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: () => ({
        allowClear: true,
        api: () => getDeptList(organizationId?.()),
        childrenField: 'children',
        class: 'w-full',
        labelField: 'name',
        maxTagCount: 'responsive',
        resultField: 'items',
        treeCheckable: true,
        valueField: 'id',
      }),
      dependencies: {
        show: (values) => values.data_scope === 'custom_depts',
        triggerFields: ['data_scope'],
      },
      fieldName: 'data_scope_dept_ids',
      label: '指定部门',
      rules: 'selectRequired',
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.role.remark'),
    },
    {
      component: 'Input',
      fieldName: 'permissions',
      formItemClass: 'items-start',
      label: $t('system.role.setPermissions'),
      modelPropName: 'modelValue',
    },
    {
      component: 'Input',
      fieldName: 'api_permissions',
      formItemClass: 'items-start',
      label: 'api授权',
      modelPropName: 'modelValue',
    },
  ];
}

export function useColumns<T = SystemRoleApi.SystemRole>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: $t('system.role.roleName'),
      width: 200,
    },
    {
      field: 'id',
      title: $t('system.role.id'),
      width: 200,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('system.role.status'),
      // width: 120,
    },
    {
      field: 'value',
      title: $t('system.role.value'),
      width: 200,
    },
    {
      field: 'data_scope',
      title: '数据范围',
      width: 160,
      formatter: ({ row }) => {
        const labelMap: Record<string, string> = {
          all: '全组织',
          custom_depts: '指定部门集合',
          self: '仅本人',
          self_dept: '本部门',
          self_dept_and_child: '本部门及下级',
        };
        const scope = row.data_scope ?? row.dataScope ?? 'self';
        return labelMap[scope] ?? scope;
      },
    },
    {
      field: 'remark',
      minWidth: 100,
      title: $t('system.role.remark'),
    },
    {
      field: 'createTime',
      title: $t('system.role.createTime'),
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.role.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.role.operation'),
      width: 130,
    },
  ];
}
