<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { GetUserListReply, UserListItem } from '#/api';
import type { SystemRoleApi } from '#/api/system/role';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Image, Tag } from 'ant-design-vue';

import Icon from '#/adapter/component/icon/icon.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { DelUser, getOrganizationMembers, getRoleList } from '#/api';
import { saveOrganizationMembers } from '#/api/system/organization';
import { getUserDeptBinding } from '#/api/system/user-dept-binding';
import {
  deleteUserRoleBinding,
  getBindingRoleIds,
  listUserRoleBindings,
} from '#/api/system/user-role-binding';
import { useOrganizationStore } from '#/store';

import FormModalDemo from './add_modal.vue';
import {
  filterUsersByQuery,
  organizationMemberToUserListItem,
  paginateUsers,
} from './helpers';
import { formOptions, gridSchemas } from './schemas';

const ALL_ROLE_VALUE = -1;
const organizationStore = useOrganizationStore();

async function ensureCurrentOrganizationId() {
  if (!organizationStore.currentOrganizationId) {
    await organizationStore.loadMyOrganizations();
  }
  return organizationStore.currentOrganizationId;
}

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
  organizationId: string,
) {
  const userRoleMap = new Map<string, number[]>();
  for (const binding of bindingReply?.items ?? []) {
    if (!binding.userId || binding.organizationId !== organizationId) {
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
): UserListRow[] {
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

type UserListRow = UserListItem & {
  dept?: string;
  deptId?: string;
  id: string;
  role: number[];
  roleIds: number[];
  roleNames: string[];
};

async function withDepartmentInfo(
  items: UserListRow[],
  organizationId: string,
): Promise<UserListRow[]> {
  const deptBindings = await Promise.all(
    items.map(async (item) => {
      try {
        const binding = await getUserDeptBinding(item.id, organizationId);
        return {
          dept: binding?.deptName ?? '',
          deptId: binding?.deptId,
          id: item.id,
        };
      } catch {
        return {
          dept: '',
          deptId: undefined,
          id: item.id,
        };
      }
    }),
  );
  const deptMap = new Map(
    deptBindings.map((item) => [
      item.id,
      { dept: item.dept, deptId: item.deptId },
    ]),
  );
  return items.map((item) => ({
    ...item,
    dept: deptMap.get(item.id)?.dept ?? '',
    deptId: deptMap.get(item.id)?.deptId,
  }));
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
        const organizationId = await ensureCurrentOrganizationId();
        if (!organizationId) {
          return {
            items: [],
            total: 0,
          };
        }
        const roleFilter = normalizeSelectedRole(role);
        const [memberReply, roleReply, bindingReply] = await Promise.all([
          getOrganizationMembers(organizationId),
          getRoleList({ organizationId }),
          listUserRoleBindings(),
        ]);
        const organizationUserReply = {
          items: filterUsersByQuery(
            memberReply.items.map((item) =>
              organizationMemberToUserListItem(item),
            ),
            userQuery,
          ),
          total: memberReply.total,
        };
        let items = withRoleInfo(
          organizationUserReply,
          buildRoleNameMap(roleReply),
          buildUserRoleMap(bindingReply, organizationId),
        );
        items = await withDepartmentInfo(items, organizationId);
        if (roleFilter !== undefined) {
          items = items.filter((item) => item.roleIds?.includes(roleFilter));
          return {
            items: paginateUsers(items, page),
            total: items.length,
          };
        }
        return {
          items: paginateUsers(items, page),
          total: items.length,
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
    const organizationId = await ensureCurrentOrganizationId();
    if (
      organizationId &&
      organizationStore.currentOrganization?.code !== 'default'
    ) {
      const members = await getOrganizationMembers(organizationId);
      await saveOrganizationMembers(
        organizationId,
        members.items
          .map((item) => item.userId)
          .filter((userId): userId is string => !!userId && userId !== row.id),
      );
    } else {
      await DelUser(row.id);
      await deleteUserRoleBinding(row.id, organizationId);
      if (organizationId) {
        await saveOrganizationMembers(organizationId, []);
      }
    }
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
          :title="
            organizationStore.currentOrganization?.code === 'default'
              ? '确定删除吗?'
              : '确定从当前组织移除吗?'
          "
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
