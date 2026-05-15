<script lang="ts" setup>
import type { OrganizationItem } from '#/api/system/organization';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  createOrganization,
  updateOrganization,
} from '#/api/system/organization';
import { pickOrganizationMutationPayload } from '#/api/system/organization-payload';

import { formSchemas } from '../schemas';

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
  destroyOnClose: true,
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const data = await formApi.getValues();
    try {
      await (id.value
        ? updateOrganization(id.value, data)
        : createOrganization(data));
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    formApi.resetForm();
    const data = modalApi.getData<OrganizationItem>();
    if (isPlainEmptyObject(data)) {
      id.value = undefined;
      modalApi.setState({ title: '新增组织' });
      formApi.setValues({ status: 1 }, false);
    } else {
      id.value = data.id;
      modalApi.setState({ title: '编辑组织' });
      formApi.setValues(pickOrganizationMutationPayload(data), false);
    }
  },
  title: '新增组织',
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
