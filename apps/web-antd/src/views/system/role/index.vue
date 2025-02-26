<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Image } from 'ant-design-vue';

import Icon from '#/adapter/component/icon/icon.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { GetRoleListByPage } from '#/api/system/role';

import FormModalDemo from './add_modal.vue';
import { gridSchemas } from './schemas';

const gridOptions: VxeGridProps<any> = {
  ...gridSchemas,
  toolbarConfig: {
    ...gridSchemas.toolbarConfig,
    slots: {
      tools: 'toolbar-tools',
    },
    // custom: {
    //   // 自定义列-图标
    //   icon: 'vxe-icon-menu',
    // },
  },
  border: false,
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await GetRoleListByPage({
          currentPage: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({
  gridOptions,
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
});

const handleAdd = () => {
  formModalApi.open();
};

const handleDel = () => {};

function addRole() {
  gridApi.reload();
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="角色列表">
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="handleAdd">
          <template #icon><Icon icon="ant-design:plus-outlined" /></template>
          新增
        </Button>
      </template>
      <template #image-url="{ row }">
        <Image :src="row.avatar" />
      </template>
      <template #action="{ row }">
        <Button type="link" @click="handleDel">
          <template #icon>
            <Icon icon="ant-design:form-outlined" />
          </template>
        </Button>
        <Button type="link" @click="handleDel">
          <template #icon>
            <Icon icon="ant-design:usergroup-delete-outlined" />
          </template>
        </Button>
        <a-popconfirm
          title="确定删除吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleDel(row)"
        >
          <Button type="link">
            <template #icon>
              <Icon icon="ant-design:delete-outlined" />
            </template>
          </Button>
        </a-popconfirm>
      </template>
    </Grid>
    <FormModal @add-role="addRole" />
  </Page>
</template>
