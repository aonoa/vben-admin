<script lang="ts" setup>
import type { ApiListItem } from '#/api/system/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { AddApi, UpdateApi } from '#/api/system/api';

import { formSchemas } from './schemas';

defineOptions({
  name: 'FormModelDemo',
});

const emit = defineEmits(['success']);
const id = ref();

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  ...formSchemas,
});

function isPlainEmptyObject(obj: unknown): obj is Record<string, never> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    Object.keys(obj).length === 0
  );
}

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  destroyOnClose: true,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      try {
        data.method = data.path.split(':')[0];
        data.path = data.path.split(':')[1];
        await (id.value ? UpdateApi(id.value, data) : AddApi(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData<ApiListItem>();
      if (isPlainEmptyObject(data)) {
        modalApi.setState({ title: '添加API' });
      } else {
        modalApi.setState({ title: '编辑API' });
        formApi.setValues(
          {
            ...data,
            path: `${data.method}:${data.path}`,
          },
          false,
        );
        id.value = data.id;
      }
    }
  },
  title: '新增API',
});
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
