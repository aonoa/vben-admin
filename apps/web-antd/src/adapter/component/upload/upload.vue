<script setup lang="ts">
import type { UploadChangeParam, UploadFile } from 'ant-design-vue';

import type { PropType } from 'vue';

import { computed, onMounted, ref, useAttrs, watch } from 'vue';

import { useAccessStore } from '@vben/stores';

import { Button, message, Upload } from 'ant-design-vue';

import { omit } from '#/utils/tool';

// import { getFileInfoByIds } from '#/api/sys/file-info';
import { Icon } from '../icon';

defineOptions({
  name: 'Upload',
  inheritAttrs: false,
});
const props = defineProps({
  value: {
    // 文件id，多个使用英文逗号分割
    type: [String] as PropType<string>,
    default: undefined,
  },
  action: {
    // 上传的地址
    type: String,
    default: `${import.meta.env.VITE_GLOB_API_URL}/v1/server/file/upload`,
  },
  headers: {
    // 上传请求的 headers
    type: Object,
    default: () => ({}),
  },
  disabled: {
    // 是否禁用
    type: Boolean,
    default: false,
  },
  listType: {
    // 上传类型
    type: String as PropType<'picture' | 'picture-card' | 'text'>,
    default: 'text',
  },
  maxCount: {
    // 最大上传数量
    type: Number,
    default: undefined,
  },
  uploadName: {
    // 文件上传字段名,name被字段名覆写了，要换成uploadName
    type: String,
    default: undefined,
  },
  separator: {
    // 文件id分隔符
    type: String,
    default: ',',
  },
});
const emits = defineEmits(['update:value']);
const accessStore = useAccessStore();
const fileList = ref<UploadFile[]>([]);
const attrs = useAttrs();
const bindProps = computed(() => {
  return {
    ...omit(attrs, ['onChange', 'onInput', 'onBlur', 'name']),
    ...props,
    name: props.uploadName || 'file',
  };
});
const _getFileInfoByIds = (val: string | string[] | undefined) => {
  if (!val) {
    // 表单重置按钮清空文件列表
    fileList.value = [];
  }
  // getFileInfoByIds({
  //   fileInfoIds: val,
  // }).then((res) => {
  //   fileList.value = res || [];
  // });
};
const mValue = computed({
  get() {
    return props.value;
  },
  set(val) {
    emits('update:value', val);
  },
});
const mHeaders = {
  Authorization: `Bearer ${accessStore.accessToken}`,
  ...props.headers,
};
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'done') {
    // 更新file-list当前file的uid
    fileList.value = fileList.value.map((item) => {
      if (item.uid === info.file.uid) {
        return {
          ...item,
          uid: info.file.response.data.fileInfoId,
        };
      }
      return item;
    });
    mValue.value = fileList.value
      .map((item) => {
        return item.uid;
      })
      .join(props.separator);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};
const handleRemove = (file: any) => {
  mValue.value = fileList.value
    .filter((item: any) => item.uid !== file.uid)
    .map((item: any) => item.uid)
    .join(props.separator);
  return true;
};
watch(
  () => props.value,
  (val) => {
    _getFileInfoByIds(val);
  },
);
onMounted(() => {
  _getFileInfoByIds(props.value);
});
</script>
<template>
  <Upload
    v-model:file-list="fileList"
    v-bind="bindProps"
    :action="action"
    :disabled="disabled"
    :headers="mHeaders"
    :list-type="listType"
    :max-count="maxCount"
    @change="handleChange"
    @remove="handleRemove"
  >
    <template #default>
      <Icon
        v-if="listType === 'picture-card'"
        :size="24"
        icon="ant-design:plus-outlined"
      />
      <Button v-else>
        上传文件
        <template #icon>
          <Icon icon="ant-design:cloud-upload-outlined" />
        </template>
      </Button>
    </template>
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Upload>
</template>
