<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';

// 按钮位置状态
const position = reactive({
  x: window.innerWidth - 70, // 默认在右下角
  y: window.innerHeight - 80,
});

// 拖动状态
const isDragging = ref(false);
const offset = reactive({ x: 0, y: 0 });
const positionDemo = ref<HTMLElement | null>(null);

// 开始拖动
const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true;

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

  // 计算鼠标/触摸点相对于按钮的偏移
  if (positionDemo.value) {
    const rect = positionDemo.value.getBoundingClientRect();
    offset.x = clientX - rect.left;
    offset.y = clientY - rect.top;
  }
};

// 处理拖动移动
const handleMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;

  // 获取事件中的坐标信息
  let clientX, clientY;
  if (e instanceof MouseEvent) {
    clientX = e.clientX;
    clientY = e.clientY;
  } else {
    const touch = e.touches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
    e.preventDefault();
  }

  // 计算新位置
  const x = clientX - offset.x;
  const y = clientY - offset.y;

  // 获取视口尺寸
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 确保按钮不会超出视口
  const buttonWidth = 56; // 按钮宽度
  const buttonHeight = 56; // 按钮高度

  position.x = Math.max(0, Math.min(x, viewportWidth - buttonWidth));
  position.y = Math.max(0, Math.min(y, viewportHeight - buttonHeight));
};

// 结束拖动
const endDrag = () => {
  isDragging.value = false;
};

// 组件挂载时添加事件监听器
onMounted(() => {
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', handleMove);
  document.addEventListener('touchend', endDrag);
});

// 组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMove);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', handleMove);
  document.removeEventListener('touchend', endDrag);
});
</script>

<template>
  <div
    id="position-demo"
    ref="positionDemo"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      right: 'auto',
      bottom: 'auto',
    }"
  >
    <div
      class="floating-button"
      id="draggableButton"
      @mousedown="startDrag"
      @touchstart="startDrag"
      :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
    >
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        alt="按钮图标"
        class="button-icon"
      />
    </div>
  </div>
</template>

<style scoped>
/* 自定义悬浮入口的位置 */
#position-demo {
  position: fixed;
  right: 10px;
  bottom: 20px;
  z-index: 1050;
  cursor: grab;
}

/* 按钮基础样式 */
.floating-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  box-shadow: none;
  transition: all 0.3s ease-in-out;
}

/* 按钮图标样式 */
.button-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.floating-button:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  transform: scale(1.1);
}
</style>
