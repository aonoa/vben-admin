<!-- FloatingAICopilotWrapper.vue -->
<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

import AiCopilot from './ai-copilot.vue';
import FloatingButton from './floating-button.vue';

// 状态
const showFloatingButton = ref(true);
const showCopilot = ref(false);
const copilotOpen = ref(false);
const floatingButtonPosition = ref<undefined | { x: number; y: number }>();
const copilotRef = ref<InstanceType<typeof AiCopilot> | null>(null);

// 添加控制渲染的状态
const shouldRenderCopilot = ref(false);

// 添加一个 key 来控制组件重置（仅在完全关闭时使用）
const copilotKey = ref(0);

// 从 localStorage 读取保存的位置
const loadSavedPosition = () => {
  const saved = localStorage.getItem('floatingButtonPosition');
  if (saved) {
    try {
      const { x, y } = JSON.parse(saved);
      if (
        x >= 0 &&
        x <= window.innerWidth &&
        y >= 0 &&
        y <= window.innerHeight
      ) {
        return { x, y };
      }
    } catch (error) {
      console.warn('Failed to parse saved position:', error);
    }
  }
  return undefined;
};

// 保存位置到 localStorage
const savePosition = (position: { x: number; y: number }) => {
  try {
    localStorage.setItem('floatingButtonPosition', JSON.stringify(position));
  } catch (error) {
    console.warn('Failed to save position:', error);
  }
};

// 初始化位置
onMounted(() => {
  const savedPosition = loadSavedPosition();
  if (savedPosition) {
    floatingButtonPosition.value = savedPosition;
  }

  document.body.style.position = 'relative';
});

// 监听悬浮按钮位置变化
const handleFloatingButtonPositionChange = (position: {
  x: number;
  y: number;
}) => {
  savePosition(position);
  floatingButtonPosition.value = position;
};

// 打开 Copilot（带位置动画）
const openCopilotWithAnimation = () => {
  showFloatingButton.value = false;

  // 确保组件已渲染
  shouldRenderCopilot.value = true;

  // 等待 DOM 更新
  setTimeout(() => {
    showCopilot.value = true;
    setTimeout(() => {
      copilotOpen.value = true;

      // 组件显示后重置最小化状态
      nextTick(() => {
        copilotRef.value?.resetState?.();
      });
    }, 50);
  }, 200);
};

// 处理最小化
const handleMinimize = () => {
  // 最小化时不重置 key，也不重新创建组件
  closeCopilotWithAnimation(false);
};

// 处理关闭
const handleClose = () => {
  // 不在这里改变 key，而是先执行关闭动画
  // 等动画完全结束后再改变 key
  closeCopilotWithAnimation(true);
};

// 关闭 Copilot（带位置动画）
const closeCopilotWithAnimation = (isClosing: boolean = false) => {
  copilotOpen.value = false;

  // 等待关闭动画完成
  setTimeout(() => {
    showCopilot.value = false;

    // 延迟显示悬浮按钮
    setTimeout(() => {
      showFloatingButton.value = true;

      // 如果是关闭操作
      if (isClosing) {
        // 再延迟一点，确保动画完全结束
        setTimeout(() => {
          // 在组件完全不可见后，才停止渲染并改变 key
          shouldRenderCopilot.value = false;

          // 改变 key，确保下次打开时重新创建组件
          copilotKey.value++;
        }, 100);
      }
    }, 200);
  }, 300);
};
</script>

<template>
  <!-- 使用 Teleport 确保层级 -->
  <Teleport to="body">
    <!-- 悬浮按钮 -->
    <Transition name="fade-scale">
      <FloatingButton
        v-show="showFloatingButton"
        class="fixed z-[9999]"
        @click="openCopilotWithAnimation"
        :initial-position="floatingButtonPosition"
        @position-change="handleFloatingButtonPositionChange"
      >
        <template #default>
          <div class="flex items-center gap-2">
            <svg class="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
              />
            </svg>
            <span class="text-sm font-medium">AI助手</span>
          </div>
        </template>
      </FloatingButton>
    </Transition>

    <!-- AI Copilot -->
    <Transition name="slide-up">
      <AiCopilot
        v-show="showCopilot"
        v-if="shouldRenderCopilot"
        v-model:open="copilotOpen"
        :key="copilotKey"
        ref="copilotRef"
        @minimize="handleMinimize"
        @close="handleClose"
      />
    </Transition>
  </Teleport>
</template>

<style scoped></style>
