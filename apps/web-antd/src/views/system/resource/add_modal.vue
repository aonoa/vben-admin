<script lang="ts" setup>
import type { ResourceListItem } from '#/api/system/resource';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { AddResource, UpdateResource } from '#/api/system/resource';

import { formSchemas } from './schemas';

defineOptions({
  name: 'FormModelDemo',
});

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

function toResourcePayload(
  values: Partial<ResourceListItem>,
): Omit<ResourceListItem, 'id'> {
  return {
    description: values.description ?? '',
    method: values.method ?? '',
    name: values.name ?? '',
    type: values.type ?? '',
    value: values.value ?? '',
  };
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
      const data = toResourcePayload(await formApi.getValues());
      try {
        await (id.value ? UpdateResource(id.value, data) : AddResource(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData<Record<string, never> | ResourceListItem>();
      if (!data || isPlainEmptyObject(data)) {
        id.value = undefined;
        modalApi.setState({ title: '添加资源' });
      } else {
        modalApi.setState({ title: '编辑资源' });
        formApi.setValues(data, false);
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
