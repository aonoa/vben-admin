<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { VBEN_DOC_URL, VBEN_GITHUB_URL } from '@vben/constants';
import { useWatermark } from '@vben/hooks';
import { BookOpenText, CircleHelp, SvgGithubIcon } from '@vben/icons';
import {
  BasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
} from '@vben/layouts';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { formatDateTime, openWindow } from '@vben/utils';

import FloatingAICopilotWrapper from '#/adapter/component/copilot/FloatingAICopilotWrapper.vue';
import {
  SITE_MESSAGE_REFRESH_EVENT,
  getMySiteMessageList,
  getMySiteMessageUnreadCount,
  markAllSiteMessagesRead,
  markSiteMessageRead,
} from '#/api/system/site-message';
import Live2D from '#/adapter/component/Live2D.vue';
import { $t } from '#/locales';
import { useAuthStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

const notifications = ref<NotificationItem[]>([]);
const unreadCount = ref(0);
const notificationPageSize = 6;

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const { isDark } = usePreferences();
const showDot = computed(() => unreadCount.value > 0);

const menus = computed(() => [
  {
    handler: () => {
      router.push({ name: 'Profile' });
    },
    icon: 'lucide:user',
    text: $t('page.auth.profile'),
  },
  {
    handler: () => {
      openWindow(VBEN_DOC_URL, {
        target: '_blank',
      });
    },
    icon: BookOpenText,
    text: $t('ui.widgets.document'),
  },
  {
    handler: () => {
      openWindow(VBEN_GITHUB_URL, {
        target: '_blank',
      });
    },
    icon: SvgGithubIcon,
    text: 'GitHub',
  },
  {
    handler: () => {
      openWindow(`${VBEN_GITHUB_URL}/issues`, {
        target: '_blank',
      });
    },
    icon: CircleHelp,
    text: $t('ui.widgets.qa'),
  },
]);

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

async function handleLogout() {
  await authStore.logout(false);
}

function mapNotificationItem(item: Record<string, any>): NotificationItem {
  return {
    avatar: preferences.app.defaultAvatar,
    date: formatDateTime(item.createdTime),
    id: item.id ?? '',
    isRead: Boolean(item.isRead),
    link: item.link || undefined,
    message: item.summary || item.content || '暂无内容',
    title: item.title || '站内信',
  };
}

async function syncNotifications(silent = true) {
  if (!accessStore.accessToken) {
    notifications.value = [];
    unreadCount.value = 0;
    return;
  }

  try {
    const [listReply, count] = await Promise.all([
      getMySiteMessageList({
        currentPage: 1,
        pageSize: notificationPageSize,
        readStatus: 'all',
      }),
      getMySiteMessageUnreadCount(),
    ]);

    notifications.value = listReply.items.map((item) => mapNotificationItem(item));
    unreadCount.value = count;
  } catch {
    if (!silent) {
      notifications.value = [];
      unreadCount.value = 0;
    }
  }
}

function remove(id: number | string) {
  notifications.value = notifications.value.filter((item) => item.id !== id);
}

async function markAllRead(refreshList = true, broadcast = true) {
  await markAllSiteMessagesRead();
  unreadCount.value = 0;
  notifications.value = notifications.value.map((item) => ({
    ...item,
    isRead: true,
  }));
  if (broadcast) {
    window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
  }

  if (refreshList) {
    await syncNotifications();
  }
}

async function handleNoticeClear() {
  await markAllRead(false, false);
  notifications.value = [];
}

async function markRead(id: number | string) {
  const item = notifications.value.find((entry) => entry.id === id);
  if (!item || item.isRead) {
    return;
  }

  await markSiteMessageRead(String(id));
  window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
  await syncNotifications();
}

async function handleMakeAll() {
  await markAllRead(true);
}

const viewAll = () => {
  router.push({ path: '/messages' });
};

const handleClick = async (item: NotificationItem) => {
  if (item.id && !item.isRead) {
    await markRead(item.id);
  }

  if (item.link) {
    navigateTo(item.link, item.query, item.state);
    return;
  }

  viewAll();
};

function navigateTo(
  link: string,
  query?: Record<string, any>,
  state?: Record<string, any>,
) {
  if (link.startsWith('http://') || link.startsWith('https://')) {
    // 外部链接，在新标签页打开
    window.open(link, '_blank');
  } else {
    // 内部路由链接，支持 query 参数和 state
    router.push({
      path: link,
      query: query || {},
      state,
    });
  }
}

const handleSiteMessageRefresh = () => {
  void syncNotifications();
};

const handleVisibilityChange = () => {
  if (!document.hidden) {
    void syncNotifications();
  }
};

onMounted(() => {
  window.addEventListener(SITE_MESSAGE_REFRESH_EVENT, handleSiteMessageRefresh);
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
  window.removeEventListener(
    SITE_MESSAGE_REFRESH_EVENT,
    handleSiteMessageRefresh,
  );
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

watch(
  () => accessStore.accessToken,
  (token) => {
    if (token) {
      void syncNotifications();
      return;
    }
    notifications.value = [];
    unreadCount.value = 0;
  },
  {
    immediate: true,
  },
);

watch(
  () => ({
    enable: preferences.app.watermark,
    content: preferences.app.watermarkContent,
    isDark: isDark.value,
  }),
  async ({ enable, content, isDark: isDarkValue }) => {
    if (enable) {
      const watermarkColor = isDarkValue
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.12)';

      await updateWatermark({
        advancedStyle: {
          colorStops: [
            {
              color: watermarkColor,
              offset: 0,
            },
            {
              color: watermarkColor,
              offset: 1,
            },
          ],
          type: 'linear',
        },
        content:
          content ||
          `${userStore.userInfo?.username} - ${userStore.userInfo?.realName}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);

// ////////////////////////////
// // 组件状态
// const copilotOpen = ref(true);
// const customTitle = ref('✨ 我的 AI 助手');
// const copilotWidth = ref('450px');
//
// // 自定义快速操作
// const customActions = reactive([
//   {
//     text: '升级信息',
//     icon: ScheduleOutlined,
//   },
//   {
//     text: '组件列表',
//     icon: AppstoreOutlined,
//   },
//   {
//     text: '代码示例',
//     icon: CodeOutlined,
//   },
//   {
//     text: '更多功能',
//     icon: AppstoreAddOutlined,
//   },
// ]);
//
// // 自定义欢迎提示
// const customPrompts = reactive([
//   { key: '1', description: '如何使用这个组件？' },
//   { key: '2', description: '组件有哪些配置选项？' },
//   { key: '3', description: '如何自定义组件样式？' },
// ]);
//
// // 自定义输入建议
// const customSuggestions = reactive([
//   { label: '创建报告', value: 'report' },
//   { label: '生成代码', value: 'code' },
//   {
//     label: '查询知识',
//     value: 'knowledge',
//     children: [
//       { label: '关于 Vue', value: 'vue' },
//       { label: '关于 Ant Design', value: 'antd' },
//     ],
//   },
// ]);
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus
        :text="userStore.userInfo?.realName"
        description="ann.vben@gmail.com"
        tag-text="Pro"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <Notification
        :dot="showDot"
        :notifications="notifications"
        @clear="handleNoticeClear"
        @read="(item) => item.id && markRead(item.id)"
        @remove="(item) => item.id && remove(item.id)"
        @make-all="handleMakeAll"
        @on-click="handleClick"
        @view-all="viewAll"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
  <!--  &lt;!&ndash; 悬浮按钮 &ndash;&gt;-->
  <!--  &lt;!&ndash; 使用悬浮按钮组件 &ndash;&gt;-->
  <!--  <FloatingButton />-->
  <!--  <AiCopilot-->
  <!--    v-model:open="copilotOpen"-->
  <!--    :title="customTitle"-->
  <!--    :width="copilotWidth"-->
  <!--  />-->
  <!-- 使用包装组件 -->
  <FloatingAICopilotWrapper />
  <Live2D />
</template>
