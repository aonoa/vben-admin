import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api';

import { $t } from '@vben/locales';

import { z } from '#/adapter/form';
import { getRoleList } from '#/api';

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
      fieldName: 'username',
      label: '账号',
    },
    {
      component: 'Input',
      componentProps: {
        class: 'w-full',
        allowClear: true,
      },
      formItemClass: 'col-span-2',
      fieldName: 'nickname',
      label: '昵称',
    },
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'ApiSelect',
      // 对应组件的参数
      componentProps: {
        class: 'w-2/3',
        filterOption: true,
        placeholder: '请选择',
        // 菜单接口转options格式
        afterFetch: (data: SystemRoleApi.GetRoleListByPageReply) => {
          return [
            {
              label: '全部角色',
              value: -1,
            },
            ...(data?.items?.map((item: any) => ({
              label: item.name,
              value: item.id,
            })) || []),
          ];
        },
        // 菜单接口
        api: getRoleList,
      },
      defaultValue: -1,
      formItemClass: 'col-span-2',
      fieldName: 'role',
      label: '角色',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        allowClear: true,
        options: [
          {
            label: '已启用',
            value: '1',
          },
          {
            label: '已禁用',
            value: '2',
          },
        ],
      },
      formItemClass: 'col-span-2',
      fieldName: 'status',
      label: '状态',
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
    { type: 'checkbox', width: 60 },
    {
      field: 'avatar',
      slots: { default: 'image-url' },
      title: '头像',
      width: 50,
    },
    // {
    //   cellRender: { name: 'CellImage' },
    //   field: 'avatar',
    //   title: '头像',
    //   width: 130,
    // },
    { field: 'username', title: '用户名' },
    { field: 'nickname', title: '昵称' },
    { field: 'email', title: '邮箱' },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: '状态',
      // width: 120,
    },
    { field: 'createTime', title: '创建时间' },
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
      fieldName: 'username',
      label: '账号',
      rules: 'required',
    },
    {
      fieldName: 'password',
      label: '密码',
      component: 'InputPassword',
      help: '5-18位数字、字母、特殊字符组成。',
      componentProps: {
        placeholder: '请输入密码',
        allowClear: true,
      },
      formItemClass: 'col-span-5',
      rules: z
        .string()
        .regex(/[\w!@#$%^&*]{5,18}/, '密码由5-18位数字、字母、特殊字符组成。'),
      dependencies: {
        if({ id }) {
          return !id;
        },
        triggerFields: ['id'],
      },
    },
    {
      fieldName: 'confirmPassword',
      label: '确认密码',
      component: 'InputPassword',
      componentProps: {
        placeholder: '请输入确认密码',
        allowClear: true,
      },
      formItemClass: 'col-span-5',
      rules: z
        .string()
        .regex(/[\w!@#$%^&*]{5,18}/, '密码由5-18位数字、字母、特殊字符组成。'),
      dependencies: {
        if({ id }) {
          return !id;
        },
        triggerFields: ['id', 'confirmPassword'],
        rules: (values) => {
          return z
            .string()
            .regex(
              /[\w!@#$%^&*]{5,18}/,
              '密码由5-18位数字、字母、特殊字符组成。',
            )
            .refine(
              (confirmPassword) => {
                return confirmPassword === values.password;
              },
              {
                message: '确认密码必须与密码一致',
              },
            );
        },
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-5',
      fieldName: 'email',
      label: '邮箱',
      rules: 'required',
    },
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'ApiSelect',
      // 对应组件的参数
      componentProps: {
        class: 'w-2/3',
        allowClear: true,
        filterOption: true,
        placeholder: '请选择',
        // 菜单接口转options格式
        afterFetch: (data: SystemRoleApi.GetRoleListByPageReply) => {
          return data?.items.map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
        },
        // 菜单接口
        api: getRoleList,
      },
      formItemClass: 'col-span-5',
      fieldName: 'role',
      label: '角色',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-5',
      fieldName: 'nickname',
      label: '昵称',
    },
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
      formItemClass: 'col-span-5',
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-5',
      fieldName: 'remark',
      label: '备注',
    },
  ],
  showDefaultActions: false,
  // 一共三列
  wrapperClass: 'grid-cols-6',
};
