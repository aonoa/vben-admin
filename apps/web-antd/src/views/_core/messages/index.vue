<script lang="ts" setup>
import type {
  SiteMessageComposeAction,
  SiteMessageItem,
  SiteMessageManageItem,
  SiteMessageManageStatus,
  SiteMessageManageStatusFilter,
  SiteMessageReadFilter,
  SiteMessageReceiverType,
} from '#/api/system/site-message';

import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { GetUserList } from '#/api';
import {
  createSiteMessage,
  deletePendingSiteMessage,
  getMySiteMessageList,
  getMySiteMessageUnreadCount,
  getSiteMessageManageList,
  markAllSiteMessagesRead,
  markSiteMessageRead,
  markSiteMessageUnread,
  recallSiteMessage,
  SITE_MESSAGE_REFRESH_EVENT,
} from '#/api/system/site-message';

defineOptions({
  name: 'SiteMessageCenter',
});

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

interface UserOption {
  keywords: string;
  label: string;
  value: string;
}

const userStore = useUserStore();
const route = useRoute();

const inboxTabs: Array<{ key: SiteMessageReadFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'unread', label: '未读' },
  { key: 'read', label: '已读' },
];

const manageTabs: Array<{ key: SiteMessageManageStatusFilter; label: string }> =
  [
    { key: 'all', label: '全部' },
    { key: 'draft', label: '草稿' },
    { key: 'scheduled', label: '待发布' },
    { key: 'published', label: '已发布' },
    { key: 'recalled', label: '已撤回' },
  ];

const inboxState = reactive({
  currentPage: 1,
  items: [] as SiteMessageItem[],
  loading: false,
  pageSize: 10,
  readStatus: 'all' as SiteMessageReadFilter,
  total: 0,
});

const manageState = reactive({
  currentPage: 1,
  items: [] as SiteMessageManageItem[],
  loading: false,
  pageSize: 10,
  total: 0,
});

const publishForm = reactive({
  content: '',
  id: '',
  receiverIds: [] as string[],
  receiverType: 'all' as SiteMessageReceiverType,
  scheduledPublishTime: '',
  summary: '',
  title: '',
});

const unreadCount = ref(0);
const markingAll = ref(false);
const submittingAction = ref<'' | SiteMessageComposeAction>('');
const recipientLoading = ref(false);
const recipientOptions = ref<UserOption[]>([]);
const expandedMessageIds = ref<string[]>([]);
const manageActiveTab = ref<SiteMessageManageStatusFilter>('all');
const inboxLoadToken = ref(0);
const manageLoadToken = ref(0);
const messageCardBodyStyle = { padding: '16px 18px' } as const;

const roleValues = computed(() => userStore.userRoles);

const canManageMessages = computed(() =>
  roleValues.value.some((value) => value === 'admin' || value === 'root'),
);

const isManageRoute = computed(
  () =>
    route.path === '/system/site-message' ||
    String(route.name ?? '') === 'SiteMessageManage',
);

const showManagePanel = computed(
  () => canManageMessages.value && isManageRoute.value,
);

const isEditing = computed(() => Boolean(publishForm.id));

const composeCardTitle = computed(() =>
  isEditing.value ? '编辑站内信' : '新建站内信',
);

function formatDate(value?: string) {
  return value || '--';
}

function getPublisherLabel(name?: string, id?: string) {
  return name || id || '--';
}

function getReceiverLabel(item: SiteMessageManageItem) {
  if (item.receiverType === 'all') {
    return '全员';
  }
  return `指定用户 ${item.receiverCount} 人`;
}

function getManageStatusLabel(status: SiteMessageManageStatus) {
  switch (status) {
    case 'draft': {
      return '草稿';
    }
    case 'recalled': {
      return '已撤回';
    }
    case 'scheduled': {
      return '待发布';
    }
    default: {
      return '已发布';
    }
  }
}

function getManageStatusColor(status: SiteMessageManageStatus) {
  switch (status) {
    case 'draft': {
      return 'default';
    }
    case 'recalled': {
      return 'red';
    }
    case 'scheduled': {
      return 'gold';
    }
    default: {
      return 'blue';
    }
  }
}

function shouldShowExpand(content?: string) {
  return Boolean(content && (content.length > 140 || content.includes('\n')));
}

function isExpanded(id?: string) {
  return Boolean(id) && expandedMessageIds.value.includes(id as string);
}

function toggleExpanded(id?: string) {
  if (!id) {
    return;
  }

  const next = new Set(expandedMessageIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  expandedMessageIds.value = [...next];
}

function resetPublishForm() {
  publishForm.content = '';
  publishForm.id = '';
  publishForm.receiverIds = [];
  publishForm.receiverType = 'all';
  publishForm.scheduledPublishTime = '';
  publishForm.summary = '';
  publishForm.title = '';
}

function fillPublishForm(item: SiteMessageManageItem) {
  publishForm.content = item.content;
  publishForm.id = item.id;
  publishForm.receiverIds = [...item.receiverIds];
  publishForm.receiverType = item.receiverType;
  publishForm.scheduledPublishTime = item.scheduledPublishTime;
  publishForm.summary = item.summary;
  publishForm.title = item.title;
}

function filterRecipientOption(input: string, option: Record<string, any>) {
  const label = String(option?.label ?? '').toLowerCase();
  const keywords = String(option?.keywords ?? '').toLowerCase();
  const keyword = input.trim().toLowerCase();
  return label.includes(keyword) || keywords.includes(keyword);
}

function canEditManageItem(item: SiteMessageManageItem) {
  return item.status === 'draft' || item.status === 'scheduled';
}

function canDeleteManageItem(item: SiteMessageManageItem) {
  return item.status === 'draft' || item.status === 'scheduled';
}

function canPublishManageItem(item: SiteMessageManageItem) {
  return item.status === 'draft' || item.status === 'scheduled';
}

function canRecallManageItem(item: SiteMessageManageItem) {
  return item.status === 'published';
}

async function refreshUnreadCount() {
  return refreshUnreadCountWithMode();
}

async function refreshUnreadCountWithMode(silent = false) {
  try {
    unreadCount.value = await getMySiteMessageUnreadCount();
  } catch {
    unreadCount.value = 0;
    if (!silent) {
      message.error('加载未读数量失败');
    }
  }
}

async function loadInbox(silent = false) {
  const requestToken = ++inboxLoadToken.value;
  const params = {
    currentPage: inboxState.currentPage,
    pageSize: inboxState.pageSize,
    readStatus: inboxState.readStatus,
  };
  inboxState.loading = true;
  try {
    const reply = await getMySiteMessageList(params);
    if (requestToken !== inboxLoadToken.value) {
      return;
    }
    inboxState.items = reply.items;
    inboxState.total = reply.total;
  } catch {
    if (requestToken !== inboxLoadToken.value) {
      return;
    }
    inboxState.items = [];
    inboxState.total = 0;
    if (!silent) {
      message.error('加载站内信列表失败');
    }
  } finally {
    if (requestToken === inboxLoadToken.value) {
      inboxState.loading = false;
    }
  }
}

async function loadManageList(silent = false) {
  if (!showManagePanel.value) {
    return;
  }

  const requestToken = ++manageLoadToken.value;
  const params = {
    currentPage: manageState.currentPage,
    pageSize: manageState.pageSize,
    status: manageActiveTab.value,
  };
  manageState.loading = true;
  try {
    const reply = await getSiteMessageManageList(params);
    if (requestToken !== manageLoadToken.value) {
      return;
    }
    manageState.items = reply.items;
    manageState.total = reply.total;
  } catch {
    if (requestToken !== manageLoadToken.value) {
      return;
    }
    manageState.items = [];
    manageState.total = 0;
    if (!silent) {
      message.error('加载发布记录失败');
    }
  } finally {
    if (requestToken === manageLoadToken.value) {
      manageState.loading = false;
    }
  }
}

async function loadRecipients(silent = false) {
  if (!showManagePanel.value) {
    return;
  }

  recipientLoading.value = true;
  try {
    const reply = await GetUserList({
      currentPage: 1,
      pageSize: 500,
    });

    recipientOptions.value = reply.items.map((item: Record<string, any>) => ({
      keywords: [item.username, item.nickname, item.email, item.id]
        .filter(Boolean)
        .join(' '),
      label: item.nickname
        ? `${item.nickname} (${item.username})`
        : item.username,
      value: item.id,
    }));
  } catch {
    recipientOptions.value = [];
    if (!silent) {
      message.error('加载目标用户列表失败');
    }
  } finally {
    recipientLoading.value = false;
  }
}

function handleInboxTabChange(key: string) {
  inboxState.readStatus = key as SiteMessageReadFilter;
  inboxState.currentPage = 1;
  void loadInbox();
}

function handleInboxPageChange(page: number, pageSize: number) {
  inboxState.currentPage = page;
  inboxState.pageSize = pageSize;
  void loadInbox();
}

function handleManagePageChange(page: number, pageSize: number) {
  manageState.currentPage = page;
  manageState.pageSize = pageSize;
  void loadManageList();
}

async function handleMarkRead(item: SiteMessageItem) {
  if (!item.id || item.isRead) {
    return;
  }

  await markSiteMessageRead(item.id);
  window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
  message.success('已标记为已读');
  await Promise.all([loadInbox(), refreshUnreadCount()]);
}

async function handleMarkUnread(item: SiteMessageItem) {
  if (!item.id || !item.isRead) {
    return;
  }

  await markSiteMessageUnread(item.id);
  window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
  message.success('已标记为未读');
  await Promise.all([loadInbox(), refreshUnreadCount()]);
}

async function handleMarkAllRead() {
  markingAll.value = true;
  try {
    const updatedCount = await markAllSiteMessagesRead();
    window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
    message.success(
      updatedCount > 0
        ? `已标记 ${updatedCount} 条站内信为已读`
        : '暂无未读站内信',
    );
    await Promise.all([loadInbox(), refreshUnreadCount()]);
  } finally {
    markingAll.value = false;
  }
}

function validatePublishForm(action: SiteMessageComposeAction) {
  if (!publishForm.title.trim()) {
    message.warning('请输入标题');
    return false;
  }
  if (!publishForm.summary.trim()) {
    message.warning('请输入摘要');
    return false;
  }
  if (!publishForm.content.trim()) {
    message.warning('请输入正文');
    return false;
  }
  if (
    action !== 'draft' &&
    publishForm.receiverType === 'user' &&
    publishForm.receiverIds.length === 0
  ) {
    message.warning('请选择目标用户');
    return false;
  }
  if (action === 'schedule') {
    if (!publishForm.scheduledPublishTime) {
      message.warning('请选择定时发布时间');
      return false;
    }
    const parsed = new Date(publishForm.scheduledPublishTime.replace(' ', 'T'));
    if (Number.isNaN(parsed.getTime())) {
      message.warning('定时发布时间格式无效');
      return false;
    }
    if (parsed.getTime() <= Date.now()) {
      message.warning('定时发布时间必须晚于当前时间');
      return false;
    }
  }
  return true;
}

async function submitSiteMessage(action: SiteMessageComposeAction) {
  if (!validatePublishForm(action)) {
    return;
  }

  submittingAction.value = action;
  try {
    const reply = await createSiteMessage({
      action,
      content: publishForm.content,
      id: publishForm.id || undefined,
      receiverIds:
        publishForm.receiverType === 'user' ? publishForm.receiverIds : [],
      receiverType: publishForm.receiverType,
      scheduledPublishTime:
        action === 'schedule' ? publishForm.scheduledPublishTime : undefined,
      summary: publishForm.summary,
      title: publishForm.title,
    });

    switch (action) {
      case 'draft': {
        message.success(isEditing.value ? '草稿已更新' : '草稿已保存');
        break;
      }
      case 'schedule': {
        message.success(
          isEditing.value ? '定时发布任务已更新' : '定时发布任务已创建',
        );
        break;
      }
      default: {
        message.success(
          reply.receiverCount > 0
            ? `发布成功，已投递 ${reply.receiverCount} 人`
            : '发布成功',
        );
        window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
        break;
      }
    }

    resetPublishForm();
    manageState.currentPage = 1;
    await loadManageList();
  } finally {
    submittingAction.value = '';
  }
}

async function handleRecall(item: SiteMessageManageItem) {
  await recallSiteMessage(item.id);
  window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
  message.success('站内信已撤回');
  await Promise.all([loadManageList(), refreshUnreadCountWithMode(true)]);
}

async function handleDelete(item: SiteMessageManageItem) {
  await deletePendingSiteMessage(item.id);
  if (publishForm.id === item.id) {
    resetPublishForm();
  }
  message.success('未发布记录已删除');
  await loadManageList();
}

async function handlePublishPending(item: SiteMessageManageItem) {
  await createSiteMessage({
    action: 'publish',
    content: item.content,
    id: item.id,
    receiverIds: item.receiverIds,
    receiverType: item.receiverType,
    summary: item.summary,
    title: item.title,
  });
  window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
  message.success('站内信已发布');
  if (publishForm.id === item.id) {
    resetPublishForm();
  }
  await loadManageList();
}

watch(
  () => publishForm.receiverType,
  (value) => {
    if (value === 'all') {
      publishForm.receiverIds = [];
    }
  },
);

watch(manageActiveTab, () => {
  manageState.currentPage = 1;
  manageState.items = [];
  manageState.total = 0;
  void loadManageList();
});

onMounted(async () => {
  if (showManagePanel.value) {
    await Promise.all([loadManageList(true), loadRecipients(true)]);
    return;
  }

  await Promise.all([loadInbox(true), refreshUnreadCountWithMode(true)]);
});

watch(showManagePanel, (enabled, previousEnabled) => {
  if (enabled && !previousEnabled) {
    void Promise.all([loadManageList(true), loadRecipients(true)]);
    return;
  }
  if (!enabled && previousEnabled) {
    void Promise.all([loadInbox(true), refreshUnreadCountWithMode(true)]);
  }
});
</script>

<template>
  <Page auto-content-height>
    <div
      v-if="showManagePanel"
      class="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)]"
    >
      <section class="min-w-0">
        <a-card :bordered="false" title="发布记录">
          <template #extra>
            <a-button size="small" @click="loadManageList">刷新</a-button>
          </template>

          <a-tabs v-model:active-key="manageActiveTab" class="-mt-2">
            <a-tab-pane
              v-for="tab in manageTabs"
              :key="tab.key"
              :tab="tab.label"
            />
          </a-tabs>

          <a-spin :key="manageActiveTab" :spinning="manageState.loading">
            <a-list
              v-if="manageState.items.length > 0"
              :data-source="manageState.items"
              item-layout="vertical"
              :split="false"
            >
              <template #renderItem="{ item }">
                <a-list-item class="!mb-3 !px-0 !py-0 last:!mb-0">
                  <a-card
                    :body-style="messageCardBodyStyle"
                    class="message-card w-full"
                  >
                    <div class="flex flex-col gap-4">
                      <div
                        class="flex flex-wrap items-start justify-between gap-3"
                      >
                        <div class="min-w-0 flex-1 space-y-2">
                          <div class="flex flex-wrap items-center gap-2">
                            <span
                              class="text-base font-medium text-[var(--ant-color-text)]"
                            >
                              {{ item.title }}
                            </span>
                            <a-tag :color="getManageStatusColor(item.status)">
                              {{ getManageStatusLabel(item.status) }}
                            </a-tag>
                            <a-tag color="blue">
{{
                              getReceiverLabel(item)
                            }}
</a-tag>
                          </div>

                          <p
                            v-if="item.summary"
                            class="mb-0 text-sm text-[var(--ant-color-text-description)]"
                          >
                            {{ item.summary }}
                          </p>
                        </div>

                        <div class="flex shrink-0 items-center gap-2">
                          <a-button
                            v-if="shouldShowExpand(item.content)"
                            type="link"
                            @click="toggleExpanded(item.id)"
                          >
                            {{ isExpanded(item.id) ? '收起正文' : '展开正文' }}
                          </a-button>
                          <a-button
                            v-if="canEditManageItem(item)"
                            type="link"
                            @click="fillPublishForm(item)"
                          >
                            编辑
                          </a-button>
                          <a-button
                            v-if="canPublishManageItem(item)"
                            type="link"
                            @click="handlePublishPending(item)"
                          >
                            立即发布
                          </a-button>
                          <a-popconfirm
                            v-if="canDeleteManageItem(item)"
                            title="确认删除这条未发布记录？"
                            @confirm="handleDelete(item)"
                          >
                            <a-button danger type="link">删除</a-button>
                          </a-popconfirm>
                          <a-popconfirm
                            v-if="canRecallManageItem(item)"
                            title="确认撤回这条已发布站内信？"
                            @confirm="handleRecall(item)"
                          >
                            <a-button danger type="link">撤回</a-button>
                          </a-popconfirm>
                        </div>
                      </div>

                      <div
                        class="mt-1 text-sm leading-6 text-[var(--ant-color-text)]"
                        :class="{ 'message-preview': !isExpanded(item.id) }"
                      >
                        {{ item.content || '暂无正文' }}
                      </div>

                      <div
                        class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--ant-color-text-description)]"
                      >
                        <span>发布人：{{
                            getPublisherLabel(item.senderName, item.senderId)
                          }}</span>
                        <span>创建时间：{{ formatDate(item.createdTime) }}</span>
                        <span>最后更新时间：{{
                            formatDate(item.updatedTime)
                          }}</span>
                        <span v-if="item.status === 'scheduled'">
                          计划发布时间：{{
                            formatDate(item.scheduledPublishTime)
                          }}
                        </span>
                        <span
                          v-if="
                            item.status === 'published' ||
                            item.status === 'recalled'
                          "
                        >
                          发布时间：{{ formatDate(item.publishedTime) }}
                        </span>
                        <span v-if="item.status === 'recalled'">
                          撤回时间：{{ formatDate(item.recalledTime) }}
                        </span>
                      </div>
                    </div>
                  </a-card>
                </a-list-item>
              </template>
            </a-list>

            <a-empty v-else description="暂无发布记录" />
          </a-spin>

          <div class="mt-4 flex justify-end">
            <a-pagination
              :current="manageState.currentPage"
              :page-size="manageState.pageSize"
              :show-size-changer="true"
              :total="manageState.total"
              @change="handleManagePageChange"
            />
          </div>
        </a-card>
      </section>

      <section>
        <a-card :bordered="false" :title="composeCardTitle">
          <template #extra>
            <a-button
              v-if="isEditing"
              size="small"
              type="link"
              @click="resetPublishForm"
            >
              取消编辑
            </a-button>
          </template>

          <a-form layout="vertical">
            <a-form-item label="标题" required>
              <a-input
                v-model:value="publishForm.title"
                :maxlength="80"
                placeholder="请输入标题"
                show-count
              />
            </a-form-item>

            <a-form-item label="摘要" required>
              <a-input
                v-model:value="publishForm.summary"
                :maxlength="120"
                placeholder="请输入摘要"
                show-count
              />
            </a-form-item>

            <a-form-item label="正文" required>
              <a-textarea
                v-model:value="publishForm.content"
                :maxlength="3000"
                :rows="7"
                placeholder="请输入正文"
                show-count
              />
            </a-form-item>

            <a-form-item label="目标范围">
              <a-radio-group v-model:value="publishForm.receiverType">
                <a-radio-button value="all">全员</a-radio-button>
                <a-radio-button value="user">指定用户</a-radio-button>
              </a-radio-group>
            </a-form-item>

            <a-form-item
              v-if="publishForm.receiverType === 'user'"
              label="目标用户"
            >
              <div class="flex flex-col gap-2">
                <div class="flex justify-end">
                  <a-button
                    :loading="recipientLoading"
                    size="small"
                    type="link"
                    @click="loadRecipients"
                  >
                    刷新用户列表
                  </a-button>
                </div>
                <a-select
                  v-model:value="publishForm.receiverIds"
                  :filter-option="filterRecipientOption"
                  :loading="recipientLoading"
                  :options="recipientOptions"
                  :show-search="true"
                  allow-clear
                  mode="multiple"
                  option-filter-prop="label"
                  placeholder="请选择目标用户"
                />
              </div>
            </a-form-item>

            <a-form-item label="计划发布时间">
              <a-date-picker
                v-model:value="publishForm.scheduledPublishTime"
                :format="DATE_TIME_FORMAT"
                class="w-full"
                placeholder="仅定时发布时使用"
                show-time
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>

            <div class="flex flex-wrap justify-end gap-2">
              <a-button @click="resetPublishForm">重置</a-button>
              <a-button
                :loading="submittingAction === 'draft'"
                @click="submitSiteMessage('draft')"
              >
                保存草稿
              </a-button>
              <a-button
                :loading="submittingAction === 'schedule'"
                @click="submitSiteMessage('schedule')"
              >
                定时发布
              </a-button>
              <a-button
                :loading="submittingAction === 'publish'"
                type="primary"
                @click="submitSiteMessage('publish')"
              >
                立即发布
              </a-button>
            </div>
          </a-form>
        </a-card>
      </section>
    </div>

    <section v-else class="min-w-0">
      <a-card :bordered="false">
        <template #title>
          <div class="flex flex-wrap items-center gap-3">
            <span>站内信收件箱</span>
            <a-badge :count="unreadCount" show-zero />
          </div>
        </template>
        <template #extra>
          <a-space>
            <a-button @click="refreshUnreadCount">刷新未读数</a-button>
            <a-button @click="loadInbox">刷新列表</a-button>
            <a-popconfirm
              title="确认将全部站内信标记为已读？"
              @confirm="handleMarkAllRead"
            >
              <a-button
                :disabled="unreadCount === 0"
                :loading="markingAll"
                type="primary"
              >
                全部标记已读
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>

        <a-tabs
          v-model:active-key="inboxState.readStatus"
          class="-mt-2"
          @change="handleInboxTabChange"
        >
          <a-tab-pane
            v-for="tab in inboxTabs"
            :key="tab.key"
            :tab="tab.label"
          />
        </a-tabs>

        <a-spin :spinning="inboxState.loading">
          <a-list
            v-if="inboxState.items.length > 0"
            :data-source="inboxState.items"
            item-layout="vertical"
            :split="false"
          >
            <template #renderItem="{ item }">
              <a-list-item class="!mb-3 !px-0 !py-0 last:!mb-0">
                <a-card
                  :body-style="messageCardBodyStyle"
                  class="message-card w-full"
                >
                  <div class="flex flex-col gap-4">
                    <div
                      class="flex flex-wrap items-start justify-between gap-3"
                    >
                      <div class="min-w-0 flex-1 space-y-2">
                        <div class="flex flex-wrap items-center gap-2">
                          <span
                            class="text-base font-medium text-[var(--ant-color-text)]"
                          >
                            {{ item.title }}
                          </span>
                          <a-tag
                            :color="item.isRead ? 'default' : 'processing'"
                          >
                            {{ item.isRead ? '已读' : '未读' }}
                          </a-tag>
                        </div>

                        <p
                          v-if="item.summary"
                          class="mb-0 text-sm text-[var(--ant-color-text-description)]"
                        >
                          {{ item.summary }}
                        </p>
                      </div>

                      <div class="flex shrink-0 items-center gap-2">
                        <a-button
                          v-if="shouldShowExpand(item.content)"
                          type="link"
                          @click="toggleExpanded(item.id)"
                        >
                          {{ isExpanded(item.id) ? '收起正文' : '展开正文' }}
                        </a-button>
                        <a-button
                          v-if="!item.isRead"
                          type="link"
                          @click="handleMarkRead(item)"
                        >
                          标记已读
                        </a-button>
                        <a-button
                          v-if="item.isRead"
                          type="link"
                          @click="handleMarkUnread(item)"
                        >
                          标记未读
                        </a-button>
                      </div>
                    </div>

                    <div
                      class="mt-1 text-sm leading-6 text-[var(--ant-color-text)]"
                      :class="{ 'message-preview': !isExpanded(item.id) }"
                    >
                      {{ item.content || '暂无正文' }}
                    </div>

                    <div
                      class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--ant-color-text-description)]"
                    >
                      <span>发送人：{{
                          getPublisherLabel(item.senderName, item.senderId)
                        }}</span>
                      <span>发送时间：{{ formatDate(item.createdTime) }}</span>
                      <span v-if="item.isRead">已读时间：{{ formatDate(item.readTime) }}</span>
                    </div>
                  </div>
                </a-card>
              </a-list-item>
            </template>
          </a-list>

          <a-empty v-else description="暂无站内信" />
        </a-spin>

        <div class="mt-4 flex justify-end">
          <a-pagination
            :current="inboxState.currentPage"
            :page-size="inboxState.pageSize"
            :show-size-changer="true"
            :total="inboxState.total"
            @change="handleInboxPageChange"
          />
        </div>
      </a-card>
    </section>
  </Page>
</template>

<style scoped>
.message-card {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.message-card:hover {
  background-color: var(--ant-color-fill-tertiary);
  border-color: var(--color-primary-border);
  box-shadow: none;
  transform: none;
}

.message-preview {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
</style>
