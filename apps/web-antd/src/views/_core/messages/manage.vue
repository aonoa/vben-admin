<script lang="ts" setup>
import type {
  SiteMessageComposeAction,
  SiteMessageManageItem,
  SiteMessageManageStatus,
  SiteMessageManageStatusFilter,
} from '#/api/system/site-message';

import { computed, onMounted, reactive, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import {
  createSiteMessage,
  deletePendingSiteMessage,
  getSiteMessageManageList,
  recallSiteMessage,
  SITE_MESSAGE_REFRESH_EVENT,
} from '#/api/system/site-message';

defineOptions({
  name: 'SiteMessageManagePage',
});

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const manageTabs: Array<{ key: SiteMessageManageStatusFilter; label: string }> =
  [
    { key: 'all', label: '全部' },
    { key: 'draft', label: '草稿' },
    { key: 'scheduled', label: '待发布' },
    { key: 'published', label: '已发布' },
    { key: 'recalled', label: '已撤回' },
  ];

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
  scheduledPublishTime: '',
  title: '',
});

const submittingAction = ref<'' | SiteMessageComposeAction>('');
const expandedMessageIds = ref<string[]>([]);
const manageActiveTab = ref<SiteMessageManageStatusFilter>('all');
const manageLoadToken = ref(0);
const messageCardBodyStyle = { padding: '16px 18px' } as const;

const isEditing = computed(() => Boolean(publishForm.id));
const composeCardTitle = computed(() =>
  isEditing.value ? '编辑站内信' : '发布站内信',
);

function formatDate(value?: string) {
  return value || '--';
}

function getPublisherLabel(name?: string, id?: string) {
  return name || id || '--';
}

function getReceiverLabel(item: SiteMessageManageItem) {
  if (item.receiverCount > 0) {
    return `全员 ${item.receiverCount} 人`;
  }
  return '全员';
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

function resetPublishForm() {
  publishForm.content = '';
  publishForm.id = '';
  publishForm.scheduledPublishTime = '';
  publishForm.title = '';
}

function fillPublishForm(item: SiteMessageManageItem) {
  publishForm.content = item.content;
  publishForm.id = item.id;
  publishForm.scheduledPublishTime = item.scheduledPublishTime;
  publishForm.title = item.title;
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

async function loadManageList(silent = false) {
  const requestToken = ++manageLoadToken.value;
  manageState.loading = true;
  try {
    const reply = await getSiteMessageManageList({
      currentPage: manageState.currentPage,
      pageSize: manageState.pageSize,
      status: manageActiveTab.value,
    });
    if (requestToken !== manageLoadToken.value) {
      return;
    }
    manageState.items = reply.items;
    manageState.total = reply.total;
  } catch (error) {
    if (requestToken !== manageLoadToken.value) {
      return;
    }
    manageState.items = [];
    manageState.total = 0;
    if (!silent) {
      message.error((error as Error)?.message || '加载发布记录失败');
    }
  } finally {
    if (requestToken === manageLoadToken.value) {
      manageState.loading = false;
    }
  }
}

function handleManagePageChange(page: number, pageSize: number) {
  manageState.currentPage = page;
  manageState.pageSize = pageSize;
  void loadManageList();
}

function validatePublishForm(action: SiteMessageComposeAction) {
  if (!publishForm.title.trim()) {
    message.warning('请输入标题');
    return false;
  }
  if (!publishForm.content.trim()) {
    message.warning('请输入正文');
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
      scheduledPublishTime:
        action === 'schedule' ? publishForm.scheduledPublishTime : undefined,
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
    await loadManageList(true);
  } catch (error) {
    message.error((error as Error)?.message || '保存站内信失败');
  } finally {
    submittingAction.value = '';
  }
}

async function handleRecall(item: SiteMessageManageItem) {
  try {
    await recallSiteMessage(item.id);
    window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
    message.success('站内信已撤回');
    await loadManageList(true);
  } catch (error) {
    message.error((error as Error)?.message || '撤回站内信失败');
  }
}

async function handleDelete(item: SiteMessageManageItem) {
  try {
    await deletePendingSiteMessage(item.id);
    if (publishForm.id === item.id) {
      resetPublishForm();
    }
    message.success('未发布记录已删除');
    await loadManageList(true);
  } catch (error) {
    message.error((error as Error)?.message || '删除未发布记录失败');
  }
}

async function handlePublishPending(item: SiteMessageManageItem) {
  try {
    await createSiteMessage({
      action: 'publish',
      content: item.content,
      id: item.id,
      title: item.title,
    });
    window.dispatchEvent(new Event(SITE_MESSAGE_REFRESH_EVENT));
    message.success('站内信已发布');
    if (publishForm.id === item.id) {
      resetPublishForm();
    }
    await loadManageList(true);
  } catch (error) {
    message.error((error as Error)?.message || '立即发布失败');
  }
}

watch(manageActiveTab, () => {
  manageState.currentPage = 1;
  manageState.items = [];
  manageState.total = 0;
  void loadManageList();
});

onMounted(async () => {
  await loadManageList(true);
});
</script>

<template>
  <Page auto-content-height>
    <div class="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)]">
      <section class="min-w-0">
        <a-card :bordered="false" title="发布记录">
          <template #extra>
            <a-button size="small" @click="loadManageList()">刷新</a-button>
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
                        <div class="min-w-0 flex-1">
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
                              {{ getReceiverLabel(item) }}
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
                        class="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--ant-color-text)]"
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
                        <span>状态：{{ getManageStatusLabel(item.status) }}</span>
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
              <a-tag color="blue">全员</a-tag>
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
