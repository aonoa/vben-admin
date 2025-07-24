<script lang="ts" setup>
import type { UserListItem } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { AddUser, UpdateUser } from '#/api';

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
        await (id.value ? UpdateUser(id.value, data) : AddUser(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData<UserListItem>();
      if (isPlainEmptyObject(data)) {
        modalApi.setState({ title: '添加用户' });
      } else {
        modalApi.setState({ title: '编辑用户' });
        // 这里可能需要过滤

        formApi.setValues(data, false);
        id.value = data.id;
      }
    }
  },
  title: '新增用户',
});
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
