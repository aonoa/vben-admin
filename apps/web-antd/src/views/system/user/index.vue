<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { GetUserListReply, UserListItem } from '#/api';
import type { SystemRoleApi } from '#/api/system/role';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Image, Tag } from 'ant-design-vue';

import Icon from '#/adapter/component/icon/icon.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { DelUser, getRoleList, GetUserList } from '#/api';
import {
  deleteUserRoleBinding,
  getBindingRoleIds,
  listUserRoleBindings,
} from '#/api/system/user-role-binding';

import FormModalDemo from './add_modal.vue';
import { formOptions, gridSchemas } from './schemas';

const ALL_ROLE_VALUE = -1;
const MAX_ROLE_FILTER_USERS = 10_000;

function normalizeSelectedRole(value: unknown) {
  const roleId = Number(value);
  return Number.isFinite(roleId) && roleId !== ALL_ROLE_VALUE
    ? roleId
    : undefined;
}

function buildRoleNameMap(roleReply: SystemRoleApi.GetRoleListByPageReply) {
  const roleNameMap = new Map<number, string>();
  for (const role of roleReply?.items ?? []) {
    roleNameMap.set(Number(role.id), role.name);
  }
  return roleNameMap;
}

function buildUserRoleMap(
  bindingReply: Awaited<ReturnType<typeof listUserRoleBindings>>,
) {
  const userRoleMap = new Map<string, number[]>();
  for (const binding of bindingReply?.items ?? []) {
    if (!binding.userId) {
      continue;
    }
    const nextRoleIds = getBindingRoleIds(binding);
    const currentRoleIds = userRoleMap.get(binding.userId) ?? [];
    userRoleMap.set(binding.userId, [
      ...new Set([...currentRoleIds, ...nextRoleIds]),
    ]);
  }
  return userRoleMap;
}

function withRoleInfo(
  reply: GetUserListReply,
  roleNameMap: Map<number, string>,
  userRoleMap: Map<string, number[]>,
) {
  return (reply.items ?? []).map((item) => {
    const roleIds = userRoleMap.get(item.id) ?? [];
    return {
      ...item,
      role: roleIds,
      roleIds,
      roleNames: roleIds.map(
        (roleId) => roleNameMap.get(roleId) ?? `${roleId}`,
      ),
    };
  });
}

const gridOptions: VxeGridProps<any> = {
  ...gridSchemas,
  toolbarConfig: {
    ...gridSchemas.toolbarConfig,
    slots: {
      tools: 'toolbar-tools',
    },
    custom: true,
    customOptions: {
      // 自定义列-图标
      icon: 'vxe-icon-menu',
    },
  },
  border: false,
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const { role, ...userQuery } = formValues ?? {};
        const roleFilter = normalizeSelectedRole(role);
        const [userReply, roleReply, bindingReply] = await Promise.all([
          GetUserList({
            currentPage: roleFilter === undefined ? page.currentPage : 1,
            pageSize:
              roleFilter === undefined ? page.pageSize : MAX_ROLE_FILTER_USERS,
            ...userQuery,
          }),
          getRoleList({}),
          listUserRoleBindings(),
        ]);
        let items = withRoleInfo(
          userReply,
          buildRoleNameMap(roleReply),
          buildUserRoleMap(bindingReply),
        );
        if (roleFilter !== undefined) {
          items = items.filter((item) => item.roleIds?.includes(roleFilter));
          const start = (page.currentPage - 1) * page.pageSize;
          return {
            items: items.slice(start, start + page.pageSize),
            total: items.length,
          };
        }
        return {
          ...userReply,
          items,
        };
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
});

const handleAdd = () => {
  formModalApi.open();
};

const handleUpdate = (row: UserListItem) => {
  formModalApi.setData(row).open();
};

const handleDel = (row: UserListItem) => {
  setTimeout(async () => {
    await DelUser(row.id);
    await deleteUserRoleBinding(row.id);
    await gridApi.reload();
  }, 1000);
};

// 信号
function addUser() {
  gridApi.reload();
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="用户列表">
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="handleAdd">
          <template #icon><Icon icon="ant-design:plus-outlined" /></template>
          新增
        </Button>
      </template>
      <template #image-url="{ row }">
        <Image :src="row.avatar" />
      </template>
      <template #roles="{ row }">
        <div
          v-if="row.roleNames?.length"
          class="flex flex-wrap justify-center gap-1"
        >
          <Tag v-for="roleName in row.roleNames" :key="roleName" color="blue">
            {{ roleName }}
          </Tag>
        </div>
        <span v-else>-</span>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="handleUpdate(row)"> 编辑 </Button>
        <a-popconfirm
          title="确定删除吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleDel(row)"
        >
          <Button type="link">删除</Button>
        </a-popconfirm>
      </template>
    </Grid>
    <FormModal @success="addUser" />
  </Page>
</template>
