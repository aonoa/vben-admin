<script setup lang="ts">
import { applyReactInVue } from 'veaury';
import { createRoot } from 'react-dom/client';
import { Page } from '@vben/common-ui';

import ReactFlowGram from './FlowGram';

const ReactFlowGramInVue = applyReactInVue(ReactFlowGram, { createRoot });
</script>

<template>
  <Page :title="$t('demos.flowgram')" description="React 组件通过 Veaury 嵌入">
    <ReactFlowGramInVue />
  </Page>
</template>
