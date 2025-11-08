<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { applyReactInVue } from 'veaury';

import Editor from './editor';
// 确保导入正确的组件
// 确认文件名和路径正确

// 使用veaury包装React组件
const ReactFlowGram = applyReactInVue(Editor);
</script>

<template>
  <Page
    auto-content-height
    :title="$t('demos.flowgram')"
    description="React 组件通过 Veaury 嵌入"
  >
    <div style="position: relative">
      <ReactFlowGram />
    </div>

    <!--    <div style="position: relative;">-->
    <!--      <ReactFlowGram />-->
    <!--    </div>-->
  </Page>
</template>
