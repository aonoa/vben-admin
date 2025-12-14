<!-- floating-button.vue -->
<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';

const props = defineProps<{
  initialPosition?: { x: number; y: number };
}>();

const emit = defineEmits<{
  click: [];
  positionChange: [position: { x: number; y: number }];
}>();

// 按钮位置状态 - 使用 reactive 使其响应式
const position = reactive({
  x: 0,
  y: 0,
});

// 初始化位置
const initPosition = () => {
  if (props.initialPosition) {
    // 如果有保存的位置，使用保存的位置
    position.x = props.initialPosition.x;
    position.y = props.initialPosition.y;
  } else {
    // 否则使用默认位置（右下角）
    position.x = window.innerWidth - 70; // 按钮宽度约56px + 边距
    position.y = window.innerHeight - 100; // 按钮高度约56px + 边距
  }
};

// 组件挂载时初始化位置
onMounted(() => {
  initPosition();

  // 监听窗口大小变化，调整位置
  const handleResize = () => {
    // 确保按钮不会超出新的窗口边界
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonWidth = 56;
    const buttonHeight = 56;

    position.x = Math.max(0, Math.min(position.x, viewportWidth - buttonWidth));
    position.y = Math.max(
      0,
      Math.min(position.y, viewportHeight - buttonHeight),
    );
  };

  window.addEventListener('resize', handleResize);
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});

// 拖动状态
const isDragging = ref(false);
const offset = reactive({ x: 0, y: 0 });
const dragStartTime = ref(0);
const dragStartPos = reactive({ x: 0, y: 0 });
const buttonRef = ref<HTMLElement | null>(null);

// 监听位置变化并通知父组件
watch(
  () => ({ x: position.x, y: position.y }),
  (newPos) => {
    emit('positionChange', newPos);
  },
  { deep: true },
);

// 创建固定的函数引用（使用箭头函数确保引用不变）
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;

  e.preventDefault();

  // 计算新位置
  const x = e.clientX - offset.x;
  const y = e.clientY - offset.y;

  // 获取视口尺寸
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 确保按钮不会超出视口
  const buttonWidth = 56;
  const buttonHeight = 56;

  position.x = Math.max(0, Math.min(x, viewportWidth - buttonWidth));
  position.y = Math.max(0, Math.min(y, viewportHeight - buttonHeight));
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;

  e.preventDefault();

  const touch = e.touches[0];

  // 计算新位置
  const x = touch.clientX - offset.x;
  const y = touch.clientY - offset.y;

  // 获取视口尺寸
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 确保按钮不会超出视口
  const buttonWidth = 56;
  const buttonHeight = 56;

  position.x = Math.max(0, Math.min(x, viewportWidth - buttonWidth));
  position.y = Math.max(0, Math.min(y, viewportHeight - buttonHeight));
};

// 鼠标移动时的拖动检查
const handleMouseMoveWithCheck = (e: MouseEvent) => {
  if (!isDragging.value) {
    // 检查是否达到拖动阈值
    const moveDistance = Math.hypot(
      e.clientX - dragStartPos.x,
      e.clientY - dragStartPos.y,
    );
    if (moveDistance > 5) {
      isDragging.value = true;
    }
  }

  if (isDragging.value) {
    handleMouseMove(e);
  }
};

// 触摸移动时的拖动检查
const handleTouchMoveWithCheck = (e: TouchEvent) => {
  if (!isDragging.value && e.touches[0]) {
    // 检查是否达到拖动阈值
    const moveDistance = Math.hypot(
      e.touches[0].clientX - dragStartPos.x,
      e.touches[0].clientY - dragStartPos.y,
    );
    if (moveDistance > 5) {
      isDragging.value = true;
    }
  }

  if (isDragging.value) {
    handleTouchMove(e);
  }
};

const handleDragEnd = () => {
  const wasDragging = isDragging.value;
  isDragging.value = false;

  // 移除事件监听器
  removeEventListeners();

  // 如果不是拖动，且点击时间很短，则触发点击事件
  if (!wasDragging && Date.now() - dragStartTime.value < 200) {
    emitClick();
  }
};

// 移除所有事件监听器
const removeEventListeners = () => {
  document.removeEventListener('mousemove', handleMouseMoveWithCheck);
  document.removeEventListener('mouseup', handleDragEnd);
  document.removeEventListener('touchmove', handleTouchMoveWithCheck);
  document.removeEventListener('touchend', handleDragEnd);
};

// 添加所有事件监听器
const addEventListeners = () => {
  document.addEventListener('mousemove', handleMouseMoveWithCheck);
  document.addEventListener('mouseup', handleDragEnd);
  document.addEventListener('touchmove', handleTouchMoveWithCheck);
  document.addEventListener('touchend', handleDragEnd);
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

  // 记录拖动开始时间和位置
  dragStartTime.value = Date.now();
  dragStartPos.x = clientX;
  dragStartPos.y = clientY;

  isDragging.value = false;

  // 计算鼠标/触摸点相对于按钮的偏移
  if (buttonRef.value) {
    const rect = buttonRef.value.getBoundingClientRect();
    offset.x = clientX - rect.left;
    offset.y = clientY - rect.top;
  }

  // 添加事件监听器
  addEventListeners();
};

// 发出点击事件
const emitClick = () => {
  emit('click');
};

// 组件卸载时确保移除所有事件监听器
onUnmounted(() => {
  removeEventListeners();
});
</script>

<template>
  <div
    id="floating-button-container"
    ref="buttonRef"
    class="fixed z-[9999]"
    :class="[isDragging ? 'cursor-grabbing' : 'cursor-grab']"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: 'translate(0, 0)' /* 覆盖可能的 transform */,
      bottom: 'auto' /* 清除 bottom */,
      right: 'auto' /* 清除 right */,
    }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <div class="floating-button">
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        alt="按钮图标"
        class="button-icon"
      />
    </div>
  </div>
</template>

<style scoped>
.floating-button {
  @apply flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border-none bg-transparent p-0 shadow-none transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)];
}

.button-icon {
  @apply h-full w-full rounded-full object-cover;
}
</style>
