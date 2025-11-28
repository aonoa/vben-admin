<script lang="ts" setup>
import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { upload_file } from '#/api/core/upload';

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
      component: 'Upload',
      componentProps: {
        placeholder: '上传图片',
        // uploadApi: uploadFileApi,
        // 更多属性见：https://ant.design/components/upload-cn
        accept: '.png,.jpg,.jpeg',
        // 自动携带认证信息
        customRequest: upload_file,
        disabled: false,
        maxCount: 1,
        multiple: false,
        showUploadList: true,
        // 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
        listType: 'picture-card',
      },
      formItemClass: 'col-span-12',
    },
    {
      fieldName: 'upload',
      label: '上传文件',
      component: 'Upload',
      componentProps: {
        placeholder: '请选择文件',
        // 自动携带认证信息
        customRequest: upload_file,
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
