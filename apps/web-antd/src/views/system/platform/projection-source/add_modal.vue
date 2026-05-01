<script lang="ts" setup>
import type { ProjectionSourceStatusItem } from '#/api/system/platform';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  addProjectionSourceStatus,
  updateProjectionSourceStatus,
} from '#/api/system/platform';

import { formSchemas } from './schemas';

const emit = defineEmits(['success']);
const id = ref<string>();

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
        await (id.value
          ? updateProjectionSourceStatus(id.value, data)
          : addProjectionSourceStatus(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      formApi.resetForm();
      const data = modalApi.getData<ProjectionSourceStatusItem>();
      if (isPlainEmptyObject(data)) {
        id.value = undefined;
        modalApi.setState({ title: '新增投影源状态' });
      } else {
        modalApi.setState({ title: '编辑投影源状态' });
        formApi.setValues(data, false);
        id.value = data.id;
      }
    }
  },
  title: '新增投影源状态',
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
