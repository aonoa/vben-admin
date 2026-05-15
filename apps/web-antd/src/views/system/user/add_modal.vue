<script lang="ts" setup>
import type { UserListItem } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  AddUser,
  getOrganizationList,
  getOrganizationMembers,
  getRoleList,
  saveOrganizationMembers,
  UpdateUser,
} from '#/api';
import {
  getUserDeptBinding,
  upsertUserDeptBinding,
} from '#/api/system/user-dept-binding';
import {
  getBindingRoleIds,
  getUserRoleBinding,
  upsertUserRoleBinding,
} from '#/api/system/user-role-binding';
import { useOrganizationStore } from '#/store';

import {
  appendUserId,
  getNewUserOrganizationIds,
  mergeRoleIds,
  normalizeDeptId,
} from './helpers';
import { createUserFormSchemas } from './schemas';

defineOptions({
  name: 'FormModelDemo',
});

const emit = defineEmits(['success']);
const id = ref();
const organizationStore = useOrganizationStore();
type UserFormValues = Omit<UserListItem, 'id'> & {
  deptId?: string;
  role?: Array<number | string> | number | string;
  roleIds?: Array<number | string>;
  roleNames?: string[];
};

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  ...createUserFormSchemas(() => organizationStore.currentOrganizationId),
});

function isPlainEmptyObject(obj: unknown): obj is Record<string, never> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    Object.keys(obj).length === 0
  );
}

async function ensureCurrentOrganizationId() {
  if (!organizationStore.currentOrganizationId) {
    await organizationStore.loadMyOrganizations();
  }
  return organizationStore.currentOrganizationId;
}

async function resolveDefaultOrganizationId() {
  const defaultOrganizationId = organizationStore.organizations.find(
    (item) => item.code === 'default',
  )?.id;
  if (defaultOrganizationId) {
    return defaultOrganizationId;
  }
  const reply = await getOrganizationList({
    code: 'default',
    currentPage: 1,
    pageSize: 1,
  });
  return reply.items.find((item) => item.code === 'default')?.id ?? '';
}

async function resolveDefaultOrganizationDefaultRoleId(
  defaultOrganizationId: string,
) {
  if (!defaultOrganizationId) {
    return undefined;
  }
  const reply = await getRoleList({
    organizationId: defaultOrganizationId,
    pageSize: 1000,
  });
  return reply.items.find((item) => item.value === 'default')?.id;
}

async function addUserToOrganization(organizationId: string, userId: string) {
  const members = await getOrganizationMembers(organizationId);
  await saveOrganizationMembers(
    organizationId,
    appendUserId(
      members.items.map((item) => item.userId),
      userId,
    ),
  );
}

async function addUserToRequiredOrganizations(userId: string) {
  const currentOrganizationId = await ensureCurrentOrganizationId();
  const defaultOrganizationId = await resolveDefaultOrganizationId();
  for (const organizationId of getNewUserOrganizationIds({
    currentOrganizationId,
    defaultOrganizationId,
  })) {
    await addUserToOrganization(organizationId, userId);
  }
}

async function getRequiredDefaultRoleIds() {
  const defaultOrganizationId = await resolveDefaultOrganizationId();
  const defaultRoleId = await resolveDefaultOrganizationDefaultRoleId(
    defaultOrganizationId,
  );
  return defaultRoleId === undefined ? [] : [defaultRoleId];
}

async function resolveCurrentAndDefaultOrganizationIds() {
  return {
    currentOrganizationId: await ensureCurrentOrganizationId(),
    defaultOrganizationId: await resolveDefaultOrganizationId(),
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
      const data = (await formApi.getValues()) as UserFormValues;
      const { deptId, role, roleIds, roleNames, ...userData } = data;
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
          const { currentOrganizationId, defaultOrganizationId } =
            await resolveCurrentAndDefaultOrganizationIds();
          const requiredDefaultRoleIds =
            currentOrganizationId === defaultOrganizationId || !id.value
              ? await getRequiredDefaultRoleIds()
              : [];
          if (!id.value) {
            await addUserToRequiredOrganizations(userId);
          }
          if (
            !id.value &&
            defaultOrganizationId &&
            currentOrganizationId !== defaultOrganizationId
          ) {
            await upsertUserRoleBinding(
              userId,
              defaultOrganizationId,
              requiredDefaultRoleIds,
            );
          }
          if (currentOrganizationId) {
            await upsertUserRoleBinding(
              userId,
              currentOrganizationId,
              currentOrganizationId === defaultOrganizationId
                ? mergeRoleIds(selectedRoleIds, requiredDefaultRoleIds)
                : selectedRoleIds,
            );
            await upsertUserDeptBinding(
              userId,
              currentOrganizationId,
              normalizeDeptId(deptId),
            );
          }
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
        formApi.setFieldValue('deptId', undefined);
        formApi.setFieldValue('roleIds', []);
      } else {
        modalApi.setState({ title: '编辑用户' });
        formApi.setValues(data, false);
        id.value = data.id;
        if (data.id) {
          void resolveCurrentAndDefaultOrganizationIds().then(
            ({ currentOrganizationId }) => {
              if (!currentOrganizationId) {
                return;
              }
              void getUserRoleBinding(data.id, currentOrganizationId).then(
                (binding) => {
                  const roleIds =
                    data.roleIds && data.roleIds.length > 0
                      ? data.roleIds
                      : getBindingRoleIds(binding);
                  formApi.setFieldValue('roleIds', roleIds);
                },
              );
              void getUserDeptBinding(data.id, currentOrganizationId).then(
                (binding) => {
                  formApi.setFieldValue('deptId', binding?.deptId);
                },
              );
            },
          );
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
