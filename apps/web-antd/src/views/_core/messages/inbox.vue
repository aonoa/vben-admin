<script lang="ts" setup>
import type {
  SiteMessageItem,
  SiteMessageReadFilter,
} from '#/api/system/site-message';

import { onMounted, reactive, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import {
  getMySiteMessageList,
  getMySiteMessageUnreadCount,
  markAllSiteMessagesRead,
  markSiteMessageRead,
  markSiteMessageUnread,
  SITE_MESSAGE_REFRESH_EVENT,
} from '#/api/system/site-message';
import { useOrganizationStore } from '#/store';

defineOptions({
  name: 'SiteMessageInboxPage',
});

const inboxTabs: Array<{ key: SiteMessageReadFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'unread', label: '未读' },
  { key: 'read', label: '已读' },
];

const inboxState = reactive({
  currentPage: 1,
  items: [] as SiteMessageItem[],
  loading: false,
  pageSize: 10,
  readStatus: 'all' as SiteMessageReadFilter,
  total: 0,
});

const unreadCount = ref(0);
const markingAll = ref(false);
const expandedMessageIds = ref<string[]>([]);
const inboxLoadToken = ref(0);
const messageCardBodyStyle = { padding: '16px 18px' } as const;
const organizationStore = useOrganizationStore();

function formatDate(value?: string) {
  return value || '--';
}

function getPublisherLabel(name?: string, id?: string) {
  return name || id || '--';
}

function shouldShowExpand(content?: string) {
  return Boolean(content && (content.length > 140 || content.includes('\n')));
}

function isExpanded(id?: string) {
  return id ? expandedMessageIds.value.includes(id) : false;
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

async function refreshUnreadCount(silent = false) {
  try {
    unreadCount.value = await getMySiteMessageUnreadCount();
  } catch (error) {
    unreadCount.value = 0;
    if (!silent) {
      message.error((error as Error)?.message || '加载未读数量失败');
    }
  }
}

async function loadInbox(silent = false) {
  const requestToken = ++inboxLoadToken.value;
  inboxState.loading = true;
  try {
    const reply = await getMySiteMessageList({
      currentPage: inboxState.currentPage,
      pageSize: inboxState.pageSize,
      readStatus: inboxState.readStatus,
    });
    if (requestToken !== inboxLoadToken.value) {
      return;
    }
    inboxState.items = reply.items;
    inboxState.total = reply.total;
  } catch (error) {
    if (requestToken !== inboxLoadToken.value) {
      return;
    }
    inboxState.items = [];
    inboxState.total = 0;
    if (!silent) {
      message.error((error as Error)?.message || '加载站内信列表失败');
    }
  } finally {
    if (requestToken === inboxLoadToken.value) {
      inboxState.loading = false;
    }
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

async function handleMarkRead(item: SiteMessageItem) {
  if (!item.id || item.isRead) {
    return;
  }

  try {
    await markSiteMessageRead(item.id);
    window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
    message.success('已标记为已读');
    await Promise.all([loadInbox(true), refreshUnreadCount(true)]);
  } catch (error) {
    message.error((error as Error)?.message || '标记已读失败');
  }
}

async function handleMarkUnread(item: SiteMessageItem) {
  if (!item.id || !item.isRead) {
    return;
  }

  try {
    await markSiteMessageUnread(item.id);
    window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
    message.success('已标记为未读');
    await Promise.all([loadInbox(true), refreshUnreadCount(true)]);
  } catch (error) {
    message.error((error as Error)?.message || '标记未读失败');
  }
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
    await Promise.all([loadInbox(true), refreshUnreadCount(true)]);
  } catch (error) {
    message.error((error as Error)?.message || '全部标记已读失败');
  } finally {
    markingAll.value = false;
  }
}

onMounted(async () => {
  if (organizationStore.organizations.length === 0) {
    await organizationStore.loadMyOrganizations();
  }
  await Promise.all([loadInbox(true), refreshUnreadCount(true)]);
});

watch(
  () => organizationStore.currentOrganizationId,
  () => {
    inboxState.currentPage = 1;
    void Promise.all([loadInbox(true), refreshUnreadCount(true)]);
  },
);
</script>

<template>
  <Page auto-content-height>
    <section class="min-w-0">
      <a-card :bordered="false">
        <template #title>
          <div class="flex flex-wrap items-center gap-3">
            <span>站内信收件箱</span>
            <a-badge :count="unreadCount" show-zero />
          </div>
        </template>
        <template #extra>
          <a-space>
            <a-button @click="refreshUnreadCount()">刷新未读数</a-button>
            <a-button @click="loadInbox()">刷新列表</a-button>
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
                      <div class="min-w-0 flex-1">
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
                      class="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--ant-color-text)]"
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
                      <span>状态：{{ item.isRead ? '已读' : '未读' }}</span>
                      <span v-if="item.isRead">
                        已读时间：{{ formatDate(item.readTime) }}
                      </span>
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
  border-color: var(--color-primary-border);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.message-card:hover {
  background-color: var(--ant-color-fill-tertiary);
  border-color: var(--color-primary);
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
