<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { GetSysLogList } from '#/api/system/log';

import { loginFormOptions, loginGridSchemas } from './schemas';

const router = useRouter();

const gridOptions: VxeGridProps<any> = {
  ...loginGridSchemas,
  toolbarConfig: {
    ...loginGridSchemas.toolbarConfig,
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
        return await GetSysLogList({
          currentPage: page.currentPage,
          pageSize: page.pageSize,
          is_login: true,
          ...formValues,
        });
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({
  formOptions: loginFormOptions,
  gridOptions,
});

const toLogInfoPage = (id: string) => {
  router.push({
    name: 'LogInfo',
    params: {
      id,
    },
  });
};
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="登录日志">
      <template #action="{ row }">
        <Button type="link" @click="toLogInfoPage(row.id)">查看详情</Button>
      </template>
    </Grid>
  </Page>
</template>
