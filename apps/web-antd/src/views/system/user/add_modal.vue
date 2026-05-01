<script lang="ts" setup>
import type { UserListItem } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { AddUser, UpdateUser } from '#/api';
import {
  getBindingRoleIds,
  getUserRoleBinding,
  upsertUserRoleBinding,
} from '#/api/system/user-role-binding';

import { formSchemas } from './schemas';

defineOptions({
  name: 'FormModelDemo',
});

const emit = defineEmits(['success']);
const id = ref();
type UserFormValues = Omit<UserListItem, 'id'> & {
  role?: Array<number | string> | number | string;
  roleIds?: Array<number | string>;
  roleNames?: string[];
};

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
      const data = (await formApi.getValues()) as UserFormValues;
      const { role, roleIds, roleNames, ...userData } = data;
      const selectedRoleIds =
        roleIds ??
        (Array.isArray(role) ? role : (role === undefined ? [] : [role]));
      void roleNames;
      try {
        const savedUser = id.value
          ? await UpdateUser(id.value, userData as Omit<UserListItem, 'id'>)
          : await AddUser(userData as Omit<UserListItem, 'id'>);
        const userId = id.value || savedUser?.id;
        if (userId) {
          await upsertUserRoleBinding(userId, selectedRoleIds);
        }
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
      const data = modalApi.getData<UserListItem>();
      if (isPlainEmptyObject(data)) {
        modalApi.setState({ title: '添加用户' });
        id.value = undefined;
      } else {
        modalApi.setState({ title: '编辑用户' });
        formApi.setValues(data, false);
        id.value = data.id;
        if (data.id) {
          getUserRoleBinding(data.id).then((binding) => {
            const roleIds =
              data.roleIds && data.roleIds.length > 0
                ? data.roleIds
                : getBindingRoleIds(binding);
            formApi.setFieldValue('roleIds', roleIds);
          });
        }
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
