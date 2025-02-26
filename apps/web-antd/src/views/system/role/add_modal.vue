<script lang="ts" setup>
import type { AccountListItem } from '#/api';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { AddUser } from '#/api';

import { formSchemas } from './schemas';

defineOptions({
  name: 'FormModelDemo',
});

const emit = defineEmits(['addRole']);

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  handleSubmit: onSubmit,
  ...formSchemas,
  wrapperClass: 'grid-rows-1',
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = modalApi.getData<Record<string, any>>();
      if (values) {
        formApi.setValues(values);
      }
    }
  },
  title: '新增用户',
});

function onSubmit(values: AccountListItem) {
  setTimeout(async () => {
    await AddUser({
      account: values.account,
      createTime: '',
      dept: '',
      email: values.email,
      id: '',
      nickname: values.nickname,
      remark: values.remark,
      role: 1,
      status: 1,
    });
    emit('addRole');
    modalApi.close();
  }, 1000);
}
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
