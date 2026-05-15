<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

import { Live2DModel } from 'pixi-live2d-display/cubism4';
import * as PIXI from 'pixi.js';

window.PIXI = PIXI; // 用于 pixi-live2d-display 内部调用

let pixiCanvas; // 放置 live2d 模型的画布
let live2DModel;
let idleTimer;
let unmounted = false;

const live2DCanvas = ref();

// 定义键盘事件处理函数
const handleKeydown = (event) => {
  if (!live2DModel) return;

  switch (event.key) {
    case ' ': {
      // 空格键切换表情或停止动画
      stopMotion();
      break;
    }
    case '1': {
      // 播放 Idle 动画（随机选择一个）
      playMotion('Idle');
      break;
    }
    case '2': {
      // 播放 Flick 动画
      playMotion('Flick');
      break;
    }
    case '3': {
      // 播放 FlickDown 动画
      playMotion('FlickDown');
      break;
    }
    case '4': {
      // 播放 Tap 动画
      playMotion('Tap');
      break;
    }
    case '5': {
      // 播放 Tap@Body 动画（点击身体）
      playMotion('Tap@Body');
      break;
    }
    case '6': {
      // 播放 Flick@Body 动画（身体轻弹）
      playMotion('Flick@Body');
      break;
    }
  }
};

// 扩展版本，包含更多控制选项
const playMotion = (motionGroup, index = 0) => {
  if (!canPlayMotion()) return;

  // 设置 Live2D 模型的表情。使用方法取决于你的模型是否有表情功能。查看模型配置文件（.model3.json）中是否有 "Expressions" 部分
  // live2DModel.expression(expression)
  // 播放指定动作组的特定索引动画
  live2DModel.motion(motionGroup, index).catch(() => {});
  // console.log(`播放动作: ${motionGroup}`);
};

// 自动循环播放 Idle 动画
const autoPlayIdleMotions = () => {
  if (!canPlayMotion()) return;

  // 每隔一段时间随机播放一个 Idle 动画
  idleTimer = window.setInterval(() => {
    if (!canPlayMotion()) return;
    // 从 Idle 动画组中随机选择一个
    const idleMotions = live2DModel.internalModel?.settings?.motions?.Idle;
    if (idleMotions && idleMotions.length > 0) {
      const randomIndex = Math.floor(Math.random() * idleMotions.length);
      playMotion('Idle', randomIndex);
    }
  }, 10_000); // 每10秒播放一次
};

// 停止所有动作
const stopMotion = () => {
  if (!canPlayMotion()) return;

  // 停止当前播放的动作
  live2DModel.internalModel.motionManager.stopAllMotions();
  // console.log('停止动作');
};

// 点击交互处理函数
const handleModelClick = () => {
  if (!canPlayMotion()) return;

  // 随机播放一个 Idle 动画
  playMotion('Idle');
};

const canPlayMotion = () => {
  const motionManager = live2DModel?.internalModel?.motionManager;
  return (
    !unmounted &&
    !!live2DModel?.motion &&
    !!motionManager &&
    !motionManager.destroyed
  );
};

onMounted(async () => {
  unmounted = false;
  pixiCanvas = new PIXI.Application({
    view: live2DCanvas.value,
    autoStart: true,
    width: 300,
    height: 570,
    backgroundAlpha: 0,
  });

  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeydown);

  // live2d 资源路径
  live2DModel = await Live2DModel.from(
    '/hiyori_free_zh/hiyori_free_t08.model3.json',
  );
  if (unmounted) {
    live2DModel.destroy();
    live2DModel = undefined;
    return;
  }

  pixiCanvas.stage.addChild(live2DModel); // 将模型添加到画布上
  live2DModel.scale.set(0.14); // 设置合适的缩放比例

  // 设置点击交互
  live2DModel.on('pointerdown', handleModelClick);
  live2DModel.buttonMode = true; // 鼠标悬停时显示指针
  live2DModel.interactive = true; // 启用交互

  // 设置模型位置（居中）
  // live2DModel.x = pixiCanvas.screen.width / 2;
  // live2DModel.y = pixiCanvas.screen.height / 2;

  // 初始播放 Idle 动画
  autoPlayIdleMotions();
});

onUnmounted(() => {
  unmounted = true;
  if (idleTimer) {
    window.clearInterval(idleTimer);
    idleTimer = undefined;
  }
  // 清理事件监听
  window.removeEventListener('keydown', handleKeydown);
  live2DModel?.off?.('pointerdown', handleModelClick);
  // 清理 Pixi.js 资源
  live2DModel?.destroy();
  pixiCanvas?.destroy();
  live2DModel = undefined;
  pixiCanvas = undefined;
});
</script>

<template>
  <canvas id="position-demo" ref="live2DCanvas"></canvas>
</template>

<style scoped>
#position-demo {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 1050;
  cursor: grab;
  transform: translate(-1700px, -24px);
}
</style>
