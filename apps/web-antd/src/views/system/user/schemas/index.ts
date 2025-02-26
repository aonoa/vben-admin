import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { z } from '#/adapter/form';

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
      width: 100,
    },
    // {
    //   cellRender: { name: 'CellImage' },
    //   field: 'avatar',
    //   title: '头像',
    //   width: 130,
    // },
    // { field: 'avatar', title: '头像' },
    { field: 'account', title: '用户名' },
    { field: 'nickname', title: '昵称' },
    { field: 'email', title: '邮箱' },
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
      fieldName: 'account',
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
      ifDetail: false,
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
      ifDetail: false,
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
      component: 'Select',
      componentProps: {
        class: 'w-2/3',
        allowClear: true,
        filterOption: true,
        options: [
          {
            label: '管理员',
            value: 2,
          },
          {
            label: '默认角色',
            value: 0,
          },
        ],
        placeholder: '请选择',
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
