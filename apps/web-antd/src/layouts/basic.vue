<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { VBEN_DOC_URL, VBEN_GITHUB_URL } from '@vben/constants';
import { useRefresh, useWatermark } from '@vben/hooks';
import {
  BookOpenText,
  CircleHelp,
  IconifyIcon,
  SvgGithubIcon,
} from '@vben/icons';
import {
  BasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
} from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { Select } from 'ant-design-vue';

import FloatingAICopilotWrapper from '#/adapter/component/copilot/FloatingAICopilotWrapper.vue';
import Live2D from '#/adapter/component/Live2D.vue';
import {
  getMySiteMessageList,
  markAllSiteMessagesRead,
  markSiteMessageRead,
  SITE_MESSAGE_REFRESH_EVENT,
} from '#/api/system';
import { $t } from '#/locales';
import { rebuildAccessRoutes } from '#/router/guard';
import { useAuthStore, useOrganizationStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

const SITE_MESSAGE_INBOX_PATH = '/messages';
const notifications = ref<NotificationItem[]>([]);
const siteMessageLoadToken = ref(0);

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const organizationStore = useOrganizationStore();
const accessStore = useAccessStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const { refresh } = useRefresh();
const showDot = computed(() =>
  notifications.value.some((item) => !item.isRead),
);
const organizationOptions = computed(() =>
  organizationStore.organizations.map((item) => ({
    label: item.name || item.code || item.id,
    value: item.id,
  })),
);
const showOrganizationSwitcher = computed(
  () => organizationOptions.value.length > 0,
);

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

function handleNoticeClear() {
  void markAllNoticeRead();
}

function markRead(id: number | string) {
  if (!id) {
    return;
  }
  void markSingleNoticeRead(String(id));
}

function remove(id: number | string) {
  notifications.value = notifications.value.filter((item) => item.id !== id);
}

function handleMakeAll() {
  void markAllNoticeRead();
}

function handleNoticeViewAll() {
  void router.push(SITE_MESSAGE_INBOX_PATH);
}

async function handleOrganizationChange(value: unknown) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return;
  }
  await organizationStore.switchOrganization(String(value));
  await rebuildAccessRoutes();
  await refresh();
}

function getNoticeAvatar() {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
}

function formatNoticeDate(value?: string) {
  return value || '--';
}

async function loadSiteMessageNotifications() {
  const requestToken = ++siteMessageLoadToken.value;
  try {
    const listReply = await getMySiteMessageList({
      currentPage: 1,
      pageSize: 6,
      readStatus: 'unread',
    });

    if (requestToken !== siteMessageLoadToken.value) {
      return;
    }

    notifications.value = listReply.items.map((item) => ({
      avatar: getNoticeAvatar(),
      date: formatNoticeDate(item.createdTime),
      id: item.id,
      isRead: item.isRead,
      link: SITE_MESSAGE_INBOX_PATH,
      message: item.content || '暂无正文',
      title: item.title,
    }));
  } catch {
    if (requestToken !== siteMessageLoadToken.value) {
      return;
    }
    notifications.value = [];
  }
}

async function markSingleNoticeRead(id: string) {
  try {
    await markSiteMessageRead(id);
    window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
    await loadSiteMessageNotifications();
  } catch {
    // 交互入口保守降级，错误提示由请求拦截器处理
  }
}

async function markAllNoticeRead() {
  try {
    await markAllSiteMessagesRead();
    window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
    await loadSiteMessageNotifications();
  } catch {
    // 交互入口保守降级，错误提示由请求拦截器处理
  }
}
watch(
  () => ({
    enable: preferences.app.watermark,
    content: preferences.app.watermarkContent,
  }),
  async ({ enable, content }) => {
    if (enable) {
      await updateWatermark({
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

function handleSiteMessageRefresh() {
  void loadSiteMessageNotifications();
}

onMounted(() => {
  window.addEventListener(SITE_MESSAGE_REFRESH_EVENT, handleSiteMessageRefresh);
  void organizationStore.loadMyOrganizations();
  void loadSiteMessageNotifications();
});

onBeforeUnmount(() => {
  window.removeEventListener(
    SITE_MESSAGE_REFRESH_EVENT,
    handleSiteMessageRefresh,
  );
});

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
        @view-all="handleNoticeViewAll"
      />
    </template>
    <template #header-right-55>
      <div
        v-if="showOrganizationSwitcher"
        class="mr-1 hidden h-full min-w-40 items-center gap-1 px-1 md:flex"
      >
        <IconifyIcon
          class="text-muted-foreground size-4 shrink-0"
          icon="lucide:building-2"
        />
        <Select
          class="w-36"
          :bordered="false"
          :loading="organizationStore.loading"
          :options="organizationOptions"
          :value="organizationStore.currentOrganizationId || undefined"
          size="small"
          @change="handleOrganizationChange"
        />
      </div>
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
