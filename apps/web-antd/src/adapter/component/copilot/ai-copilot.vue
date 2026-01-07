<script lang="ts" setup>
import type { BubbleListProps } from 'ant-design-x-vue';

import {
  computed,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';

import {
  CloseOutlined,
  FullscreenOutlined,
  MinusOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { Button, Card } from 'ant-design-vue';
import { message as antMessage } from 'ant-design-vue/es/components';
import { BubbleList, Sender, Welcome } from 'ant-design-x-vue';

import { CopilotSSE } from '#/api/system/copilot';

interface MessageItem {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
}

// 组件名称
defineOptions({ name: 'AICopilotAntdX' });
// 定义事件
const emit = defineEmits<{
  close: [];
  minimize: [];
}>();
// Component state
const inputMessage = ref('');
const messages = ref<MessageItem[]>([
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Based on Ant Design, AI product interface solution, create a better intelligent vision~',
    timestamp: Date.now(),
  },
]);

const isMinimized = ref(false);
const isMaximized = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const isMessagesCount = computed(() => messages.value?.length > 1);

// 拖拽相关状态
const isDragging = ref(false);
const offset = reactive({ x: 0, y: 0 });
const position = reactive({
  x: window.innerWidth - 440,
  y: window.innerHeight - window.innerHeight * 0.86,
});

const cardRef = ref<HTMLElement | null>(null);

// 优化性能：使用 requestAnimationFrame
let animationFrameId: null | number = null;

// 添加重置状态的方法
const resetState = () => {
  isMinimized.value = false;
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;

  e.preventDefault();

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  animationFrameId = requestAnimationFrame(() => {
    // 计算新位置
    const x = e.clientX - offset.x;
    const y = e.clientY - offset.y;

    // 获取视口尺寸
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 确保卡片不会超出视口
    const cardWidth = isMaximized.value ? viewportWidth : 400;
    const cardHeight = isMaximized.value
      ? viewportHeight
      : viewportHeight * 0.8;

    position.x = Math.max(0, Math.min(x, viewportWidth - cardWidth));
    position.y = Math.max(0, Math.min(y, viewportHeight - cardHeight));
  });
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;

  e.preventDefault();

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  animationFrameId = requestAnimationFrame(() => {
    const touch = e.touches[0];

    // 计算新位置
    const x = touch.clientX - offset.x;
    const y = touch.clientY - offset.y;

    // 获取视口尺寸
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 确保卡片不会超出视口
    const cardWidth = isMaximized.value ? viewportWidth : 400;
    const cardHeight = isMaximized.value
      ? viewportHeight
      : viewportHeight * 0.8;

    position.x = Math.max(0, Math.min(x, viewportWidth - cardWidth));
    position.y = Math.max(0, Math.min(y, viewportHeight - cardHeight));
  });
};

// 移除所有事件监听器
const removeEventListeners = () => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleDragEnd);
  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchend', handleDragEnd);

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

// 添加所有事件监听器
const addEventListeners = () => {
  document.addEventListener('mousemove', handleMouseMove, { passive: false });
  document.addEventListener('mouseup', handleDragEnd, { passive: false });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleDragEnd, { passive: false });
};

const handleDragEnd = () => {
  isDragging.value = false;
  removeEventListeners();
};

// 开始拖动
const startDrag = (e: MouseEvent | TouchEvent) => {
  // 阻止事件冒泡，避免影响其他组件
  e.stopPropagation();

  // 获取事件中的坐标信息
  let clientX, clientY;
  if (e instanceof MouseEvent) {
    clientX = e.clientX;
    clientY = e.clientY;
    e.preventDefault();
  } else {
    const touch = e.touches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
    e.preventDefault();
  }

  isDragging.value = true;

  // 计算鼠标/触摸点相对于卡片的偏移
  if (cardRef.value) {
    const rect = cardRef.value.getBoundingClientRect();
    offset.x = clientX - rect.left;
    offset.y = clientY - rect.top;
  }

  // 先移除可能存在的旧监听器，再添加新的
  removeEventListeners();
  addEventListeners();
};

// Component methods
const sendMessage = async () => {
  const content = inputMessage.value.trim();
  if (!content) return;

  const userMessage: MessageItem = {
    id: `msg_${Date.now()}_user`,
    role: 'user',
    content,
    timestamp: Date.now(),
  };
  messages.value.push(userMessage);
  inputMessage.value = '';

  try {
    await generateAIResponse(content);
  } catch (error) {
    console.error('Error generating response:', error);
    antMessage.error('Failed to get AI response');
  }
};

const generateAIResponse = async (question: string): Promise<void> => {
  if (!question) return;
  const loadingMessageId = `msg_${Date.now()}_loading`;
  messages.value.push({
    id: loadingMessageId,
    role: 'assistant',
    content: 'Thinking...',
    timestamp: Date.now(),
  });

  // let response = '';
  let flag = true;

  await CopilotSSE(
    { id: loadingMessageId, items: messages.value.slice(1, -1) },
    {
      onMessage: (chunk) => {
        // 更新UI显示
        messages.value.forEach((msg) => {
          if (msg.id === loadingMessageId) {
            if (chunk === '{}') {
              return;
            }
            if (flag) {
              msg.content = chunk;
              flag = false;
            } else {
              msg.content += chunk;
            }
          }
        });
      },
      onEnd: () => {
        // console.error('请求失败:', error);
      },
    },
  );
};

// 优化 scrollToBottom 方法
const scrollToBottom = () => {
  if (messagesContainer.value) {
    // 使用平滑滚动
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth',
    });
  }
};

// 修复后的滚轮事件处理
const handleWheel = (e: WheelEvent) => {
  // 获取消息容器元素
  const element = messagesContainer.value;
  if (!element) return;

  // 检查是否在边界
  const isAtTop = element.scrollTop <= 0;
  const isAtBottom =
    Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <=
    1;

  // 如果滚动方向向上且在顶部，或者滚动方向向下且在底部，则阻止事件
  const isScrollingUp = e.deltaY < 0;
  const isScrollingDown = e.deltaY > 0;

  if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  // 如果事件发生在消息区域内，阻止冒泡到 document
  e.stopPropagation();
};

// 添加全局的 wheel 事件监听器来阻止页面滚动
const preventPageScroll = (e: WheelEvent) => {
  // 检查事件是否发生在我们的组件内
  if (cardRef.value && cardRef.value.contains(e.target as Node)) {
    // 阻止默认行为（页面滚动）但允许组件内滚动
    const element = messagesContainer.value;
    if (element && element.contains(e.target as Node)) {
      // 消息区域内的滚动由 handleWheel 处理
      return;
    }
    // 如果是卡片其他区域，阻止页面滚动
    e.preventDefault();
  }
};

const preventTouchScroll = (e: TouchEvent) => {
  if (cardRef.value && cardRef.value.contains(e.target as Node)) {
    e.preventDefault();
  }
};

const minimizeCopilot = () => {
  isMinimized.value = !isMinimized.value;
  emit('minimize');
};

const maximizeCopilot = () => {
  isMaximized.value = !isMaximized.value;
  if (isMaximized.value) {
    position.x = 0;
    position.y = 0;
  } else {
    position.x = window.innerWidth - 440;
    position.y = window.innerHeight - 820;
  }
};

const closeCopilot = () => {
  emit('close');
};

// 初始化滚动到底部
nextTick(() => {
  scrollToBottom();
});

// 监听消息数组变化，自动滚动到底部
watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { deep: true },
);

// 在组件挂载时添加事件监听
onMounted(() => {
  // 添加全局 wheel 事件监听器
  document.addEventListener('wheel', preventPageScroll, { passive: false });

  // 添加 touchmove 事件处理，防止移动端的滚动穿透
  document.addEventListener('touchmove', preventTouchScroll, {
    passive: false,
  });
});

// 组件卸载时确保移除所有事件监听器
onUnmounted(() => {
  // 移除全局事件监听器
  document.removeEventListener('wheel', preventPageScroll);
  document.removeEventListener('touchmove', preventTouchScroll);

  removeEventListeners();
});

// 暴露 resetState 方法给父组件
defineExpose({
  resetState,
  minimizeCopilot,
  maximizeCopilot,
  closeCopilot,
});

const bubbleItems = computed(() => {
  return messages.value.map((msg) => ({
    key: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp,
  }));
});

// 动态计算气泡的最大宽度
const bubbleMaxWidth = computed(() => {
  return isMaximized.value ? 'calc(100vw - 80px)' : '600px';
});

// 或者固定几种百分比
const responsiveHeight = computed(() => {
  if (isMinimized.value) return 'h-[60px]';
  if (isMaximized.value) return 'h-screen';

  const screenHeight = window.innerHeight;
  if (screenHeight < 600) return 'h-[85vh]'; // 小屏幕占80%
  if (screenHeight < 800) return 'h-[75vh]'; // 中等屏幕占75%
  return 'h-[80vh]'; // 大屏幕占70%
});

const roles = computed<BubbleListProps['roles']>(() => ({
  assistant: {
    placement: 'start',
    avatar: {
      icon: h(RobotOutlined),
      style: {
        background: '#1890ff',
        color: '#fff',
        width: '32px',
        height: '32px',
        fontSize: '16px',
      },
    },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: bubbleMaxWidth.value,
      fontSize: isMaximized.value ? '15px' : '14px',
    },
    contentStyle: {
      maxWidth: bubbleMaxWidth.value,
    },
  },
  user: {
    placement: 'end',
    avatar: {
      icon: h(UserOutlined),
      style: {
        background: '#87d068',
        color: '#fff',
        width: '32px',
        height: '32px',
        fontSize: '16px',
      },
    },
    style: {
      maxWidth: bubbleMaxWidth.value,
      fontSize: isMaximized.value ? '15px' : '14px',
    },
    contentStyle: {
      maxWidth: bubbleMaxWidth.value,
    },
  },
}));

// 监听最大化状态变化，重新计算位置
watch(isMaximized, () => {
  if (!isMaximized.value) {
    position.x = window.innerWidth - 440;
    position.y = window.innerHeight - 820;
  }
  // 当最大化状态变化时，强制重新计算气泡样式
  nextTick(() => {
    if (messagesContainer.value) {
      scrollToBottom();
    }
  });
});
</script>

<template>
  <div
    ref="cardRef"
    class="fixed z-[1050]"
    :class="[
      isDragging ? 'cursor-grabbing' : 'cursor-default',
      isMaximized ? 'inset-0' : '',
    ]"
    :style="
      !isMaximized ? { left: `${position.x}px`, top: `${position.y}px` } : {}
    "
    @wheel.stop="handleWheel"
  >
    <!-- 外层容器：只在非拖拽时应用过渡动画 -->
    <div :class="!isDragging ? 'transition-all duration-300' : ''">
      <Card
        hoverable
        :bordered="true"
        class="relative flex flex-col overflow-hidden shadow-lg"
        :class="[
          isMaximized
            ? 'h-screen w-screen rounded-none'
            : 'w-[400px] rounded-lg',
          // 只在非拖拽时应用高度过渡动画
          !isDragging ? 'transition-[height] duration-300' : '',
          isMinimized ? 'h-[60px]' : responsiveHeight,
        ]"
      >
        <!-- Header - 使用flex-shrink:0防止被压缩 -->
        <template #title>
          <div
            class="flex-shrink-0 select-none"
            :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
            @mousedown="startDrag"
            @touchstart.passive="startDrag"
          >
            <span class="text-base font-medium">✨ AI Copilot</span>
          </div>
        </template>

        <template #extra>
          <div class="flex flex-shrink-0 gap-1">
            <Button
              type="text"
              size="small"
              class="flex h-6 w-6 items-center justify-center p-0"
              @click="minimizeCopilot"
            >
              <MinusOutlined />
            </Button>
            <Button
              type="text"
              size="small"
              class="flex h-6 w-6 items-center justify-center p-0"
              @click="maximizeCopilot"
            >
              <FullscreenOutlined />
            </Button>
            <Button
              type="text"
              size="small"
              class="flex h-6 w-6 items-center justify-center p-0"
              @click="closeCopilot"
            >
              <CloseOutlined />
            </Button>
          </div>
        </template>

        <!-- 主要内容区域：使用flex-grow:1占据剩余空间 -->
        <div v-if="!isMinimized" class="flex flex-1 flex-col overflow-hidden">
          <!-- Messages Area - 使用flex-1和overflow-auto实现滚动 -->
          <div
            ref="messagesContainer"
            class="custom-scrollbar flex-1 overflow-y-auto p-6"
            :class="isMaximized ? 'px-8 py-8' : ''"
          >
            <Welcome
              v-if="!isMessagesCount"
              icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
              title="您好，我是您的AI助手"
              description="您可以向我提问任何问题~"
            />
            <BubbleList :roles="roles" :items="bubbleItems.slice(1)" />
          </div>

          <!-- Footer - 使用flex-shrink:0固定在底部 -->
          <div
            class="flex-shrink-0 border-t p-4"
            :class="isMaximized ? 'px-8' : ''"
          >
            <Sender
              v-model:value="inputMessage"
              placeholder="Ask a question or type / to use tools"
              @submit="sendMessage"
              class="w-full"
              :auto-size="{ minRows: 1, maxRows: 4 }"
              :style="isMaximized ? { fontSize: '15px' } : {}"
            />
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
/* 拖拽时优化性能 */
.dragging {
  transition: none !important;
}

/* 让内容换行 */
:deep(.ant-bubble-content) {
  white-space: pre-line;
}

:deep(.ant-card-body) {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0; /* 重要：防止内容溢出 */
  padding: 0;
}

/* 添加自定义滚动条样式以确保更好的滚动体验 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Firefox */
.custom-scrollbar {
  scrollbar-color: #c1c1c1 #f1f1f1;
  scrollbar-width: thin;
}

/* 为最大化状态优化气泡样式 */
:deep(.bubble-container) {
  transition: max-width 0.3s ease;
}

:deep(.bubble-content) {
  transition: max-width 0.3s ease;
}

/* 优化最大化状态下的内边距和间距 */
.maximized-messages {
  padding-right: 2rem !important;
  padding-left: 2rem !important;
}
</style>
