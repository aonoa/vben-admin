<script setup lang="ts">
import { applyReactInVue } from 'veaury';
import { Page } from '@vben/common-ui';

// 确保导入正确的组件
import FlowGramEditor from './FlowGramEditor'; // 确认文件名和路径正确

// 使用veaury包装React组件
const ReactFlowGram = applyReactInVue(FlowGramEditor);
</script>

<template>
  <Page auto-content-height :title="$t('demos.flowgram')" description="React 组件通过 Veaury 嵌入">
    <div style="position: relative;">
      <ReactFlowGram />
    </div>

<!--    <div style="position: relative;">-->
<!--      <ReactFlowGram />-->
<!--    </div>-->
  </Page>
</template>
