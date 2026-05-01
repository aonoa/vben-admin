<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { BusinessDomainItem } from '#/api/system/platform';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import Icon from '#/adapter/component/icon/icon.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteBusinessDomain,
  getBusinessDomainList,
} from '#/api/system/platform';

import FormModal from './add_modal.vue';
import { gridSchemas } from './schemas';

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
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        return await getBusinessDomainList();
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const [BusinessDomainModal, businessDomainModalApi] = useVbenModal({
  connectedComponent: FormModal,
});

function handleAdd() {
  businessDomainModalApi.open();
}

function handleUpdate(row: BusinessDomainItem) {
  businessDomainModalApi.setData(row).open();
}

async function handleDel(row: BusinessDomainItem) {
  if (!row.id) {
    return;
  }
  await deleteBusinessDomain(row.id);
  await gridApi.reload();
}

function refreshGrid() {
  gridApi.reload();
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="业务域管理">
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
    <BusinessDomainModal @success="refreshGrid" />
  </Page>
</template>
