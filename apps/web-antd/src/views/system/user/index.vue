<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { UserListItem } from '#/api';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Image } from 'ant-design-vue';

import Icon from '#/adapter/component/icon/icon.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { DelUser, GetUserList } from '#/api';

import FormModalDemo from './add_modal.vue';
import { formOptions, gridSchemas } from './schemas';

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
        return await GetUserList({
          currentPage: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
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
