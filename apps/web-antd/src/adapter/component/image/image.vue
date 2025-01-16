<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { Upload } from 'ant-design-vue';

// import { uploadFile } from '#/api/sys/file-info';
import { Icon } from '../icon';

defineOptions({
  inheritAttrs: false,
});
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  uploadApi: {
    type: Function,
    default: undefined,
  },
});
const emits = defineEmits(['update:value']);
const mValue = useVModel(props, 'value', emits, {
  defaultValue: props.value,
  passive: true,
});
const customRequest = (e: any) => {
  props
    ?.uploadApi({
      file: e.file,
    })
    .then((data: any) => {
      mValue.value = data.fullUrl;
    });
};
const handleRemove = (e: Event) => {
  e.stopPropagation();
  mValue.value = '';
};
</script>
<template>
  <Upload
    :custom-request="customRequest"
    :show-upload-list="false"
    list-type="picture-card"
  >
    <div v-if="mValue" class="m-avatar-wrap">
      <Icon
        class="m-avatar-icon-delete"
        icon="ant-design:delete-outlined"
        @click="handleRemove"
      />
      <img :src="value" width="100%" />
    </div>
    <Icon v-else icon="ant-design:plus-outlined" />
  </Upload>
</template>
<style lang="less" scoped>
.m-avatar-wrap {
  position: relative;
  height: 102px;
  .m-avatar-icon-delete {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }
}
</style>
