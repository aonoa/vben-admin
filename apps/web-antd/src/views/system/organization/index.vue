<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { OrganizationItem } from '#/api/system/organization';

import { computed, ref } from 'vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Button, Tag } from 'ant-design-vue';

import Icon from '#/adapter/component/icon/icon.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteOrganization,
  getOrganizationList,
} from '#/api/system/organization';

import { canManageOrganizationButtons } from './helpers';
import OrganizationModal from './modules/form.vue';
import MemberDrawer from './modules/member-drawer.vue';
import PermissionScopeDrawer from './modules/permission-scope-drawer.vue';
import { formOptions, gridSchemas } from './schemas';

const organizationManagementCapability = ref(false);
const canManageOrganizations = computed(() =>
  canManageOrganizationButtons(organizationManagementCapability.value),
);

const gridOptions: VxeGridProps<OrganizationItem> = {
  ...gridSchemas,
  toolbarConfig: {
    ...gridSchemas.toolbarConfig,
    slots: {
      tools: 'toolbar-tools',
    },
  },
  border: false,
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const reply = await getOrganizationList({
          currentPage: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        organizationManagementCapability.value = reply.canManageOrganizations;
        return reply;
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: OrganizationModal,
  destroyOnClose: true,
});

const [MemberManagementDrawer, memberDrawerApi] = useVbenDrawer({
  connectedComponent: MemberDrawer,
  destroyOnClose: true,
});

const [PermissionScopeManagementDrawer, permissionScopeDrawerApi] =
  useVbenDrawer({
    connectedComponent: PermissionScopeDrawer,
    destroyOnClose: true,
  });

function openMemberDrawer(row: OrganizationItem) {
  memberDrawerApi.setData(row).open();
}

function openPermissionScopeDrawer(row: OrganizationItem) {
  permissionScopeDrawerApi.setData(row).open();
}

function handleAdd() {
  formModalApi.setData({}).open();
}

function handleUpdate(row: OrganizationItem) {
  formModalApi.setData(row).open();
}

async function handleDelete(row: OrganizationItem) {
  if (!row.id) {
    return;
  }
  await deleteOrganization(row.id);
  await gridApi.reload();
}

function handleSaved() {
  gridApi.reload();
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="组织列表">
      <template #toolbar-tools>
        <Button
          v-show="canManageOrganizations"
          class="mr-2"
          type="primary"
          @click="handleAdd"
        >
          <template #icon>
            <Icon icon="lucide:plus" />
          </template>
          新增
        </Button>
      </template>

      <template #status="{ row }">
        <Tag :color="row.status === 1 ? 'success' : 'default'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </Tag>
      </template>

      <template #action="{ row }">
        <div class="flex items-center justify-center whitespace-nowrap">
          <Button type="link" @click="openMemberDrawer(row)">成员</Button>
          <Button
            v-show="canManageOrganizations"
            type="link"
            @click="openPermissionScopeDrawer(row)"
          >
            权限范围
          </Button>
          <Button
            v-show="canManageOrganizations"
            type="link"
            @click="handleUpdate(row)"
          >
            编辑
          </Button>
          <span v-show="canManageOrganizations">
            <a-popconfirm
              title="确定删除吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(row)"
            >
              <Button danger type="link">删除</Button>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </Grid>

    <FormModal @success="handleSaved" />
    <MemberManagementDrawer @success="handleSaved" />
    <PermissionScopeManagementDrawer @success="handleSaved" />
  </Page>
</template>
