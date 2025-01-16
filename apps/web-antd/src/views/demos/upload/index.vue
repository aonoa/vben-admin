<script lang="ts" setup>
import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { uploadFileApi } from '#/api/core/upload';

const [BaseForm] = useVbenForm({
  // 提交函数
  handleSubmit: onSubmit,

  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入用户名',
      },
      // 字段名
      fieldName: 'username',
      // 界面显示的label
      label: '字符串',
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'switch',
      label: '开关',
    },
    {
      fieldName: 'image',
      label: '上传图片',
      component: 'Image',
      componentProps: {
        placeholder: '请选择需要上传的图片',
        uploadApi: uploadFileApi,
      },
      formItemClass: 'col-span-12',
    },
    {
      fieldName: 'upload',
      label: '上传文件',
      component: 'Upload',
      componentProps: {
        placeholder: '请选择文件',
      },
      formItemClass: 'col-span-12',
    },
  ],
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Card title="基础示例">
    <BaseForm />
  </Card>
</template>
