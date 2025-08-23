<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { ApiListItem } from '#/api/system/api';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import Icon from '#/adapter/component/icon/icon.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { DelApi, GetApiList } from '#/api/system/api';

import FormModalDemo from './add_modal.vue';
import { formOptions, gridSchemas } from './schemas';

const gridOptions: VxeGridProps<any> = {
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
        return await GetApiList({
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

const handleUpdate = (row: ApiListItem) => {
  formModalApi.setData(row).open();
};

const handleDel = (row: ApiListItem) => {
  setTimeout(async () => {
    await DelApi(row.id);
    await gridApi.reload();
  }, 1000);
};

// 信号
function addApi() {
  gridApi.reload();
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="API资源列表">
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="handleAdd">
          <template #icon><Icon icon="ant-design:plus-outlined" /></template>
          新增
        </Button>
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
    <FormModal @success="addApi" />
  </Page>
</template>
