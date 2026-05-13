<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getServiceRegistryList } from '#/api/system/platform';

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
        return await getServiceRegistryList();
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

function refreshGrid() {
  gridApi.reload();
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="服务注册">
      <template #toolbar-tools>
        <a-button class="mr-2" @click="refreshGrid">刷新</a-button>
      </template>
    </Grid>
  </Page>
</template>
