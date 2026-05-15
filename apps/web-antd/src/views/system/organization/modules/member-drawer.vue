<script lang="ts" setup>
import type { OrganizationMemberPage, OrganizationMemberRow } from '../helpers';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type {
  OrganizationItem,
  OrganizationMemberItem,
} from '#/api/system/organization';

import { computed, nextTick, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  Button,
  Empty,
  Input,
  message,
  Modal,
  Pagination,
  RadioGroup,
  Spin,
  Tag,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getMyOrganizations,
  getOrganizationMembers,
  saveOrganizationMembers,
} from '#/api/system/organization';

import {
  appendOrganizationMemberId,
  collectOrganizationMemberIds,
  filterOrganizationMembers,
  markCurrentOrganizationMembers,
  normalizeOrganizationMembers,
  paginateOrganizationMembers,
  removeOrganizationMemberId,
} from '../helpers';

type MemberScope = 'all' | 'current';

interface MemberTableRow extends OrganizationMemberRow {
  inCurrentOrganization: boolean;
}

const emit = defineEmits<{
  success: [];
}>();

const DEFAULT_ORGANIZATION_CODE = 'default';

const drawerLoading = ref(false);
const memberSavingAction = ref<'add' | 'remove' | null>(null);
const defaultOrganizationId = ref('');
const currentOrganization = ref<OrganizationItem>();
const memberSearchInput = ref('');
const memberSearchKeyword = ref('');
const memberScope = ref<MemberScope>('all');
const memberPage = reactive<OrganizationMemberPage>({
  currentPage: 1,
  pageSize: 10,
});
const defaultMembers = ref<OrganizationMemberRow[]>([]);
const currentMembers = ref<OrganizationMemberRow[]>([]);
const currentMemberIds = ref<string[]>([]);
const selectedUserIds = ref<string[]>([]);

const isDefaultOrganization = computed(
  () => currentOrganization.value?.code === DEFAULT_ORGANIZATION_CODE,
);
const tableRows = computed<MemberTableRow[]>(() => {
  return markCurrentOrganizationMembers(
    defaultMembers.value,
    currentMemberIds.value,
  ) as MemberTableRow[];
});

const scopeOptions = computed<Array<{ label: string; value: MemberScope }>>(
  () => [
    { label: '全部成员', value: 'all' },
    { label: currentOrganization.value?.name || '当前组织', value: 'current' },
  ],
);

const filteredMembers = computed(() => {
  let byScope = tableRows.value;
  if (memberScope.value === 'current') {
    byScope = tableRows.value.filter((item) => item.inCurrentOrganization);
  }
  return filterOrganizationMembers(byScope, memberSearchKeyword.value);
});

const pagedMembers = computed(() => {
  return paginateOrganizationMembers(filteredMembers.value, memberPage);
});

const selectedRows = computed(() => {
  return tableRows.value.filter((item) =>
    selectedUserIds.value.includes(item.userId),
  );
});
const selectedCount = computed(() => selectedUserIds.value.length);
const selectedCurrentCount = computed(
  () => selectedRows.value.filter((item) => item.inCurrentOrganization).length,
);
const selectedAvailableCount = computed(
  () => selectedRows.value.filter((item) => !item.inCurrentOrganization).length,
);
const isViewingCurrentOrganization = computed(
  () => memberScope.value === 'current',
);

const memberGridOptions: VxeGridProps<MemberTableRow> = {
  checkboxConfig: {
    checkMethod: ({ row }) =>
      !isDefaultOrganization.value || row.inCurrentOrganization,
    highlight: true,
  },
  columns: [
    { type: 'checkbox', width: 56 },
    { field: 'username', minWidth: 140, title: '用户名' },
    { field: 'nickname', minWidth: 140, title: '昵称' },
    { field: 'email', minWidth: 200, title: '邮箱' },
    {
      field: 'inCurrentOrganization',
      slots: { default: 'member-badge' },
      title: '当前组织',
      width: 120,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: '状态',
      width: 100,
    },
    { field: 'createTime', minWidth: 170, title: '创建时间' },
  ],
  data: pagedMembers.value,
  height: 500,
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  rowConfig: {
    keyField: 'userId',
  },
  toolbarConfig: {
    custom: false,
    export: false,
    print: false,
    refresh: false,
  },
};

const [MemberGrid, memberGridApi] = useVbenVxeGrid({
  gridEvents: {
    checkboxAll: ({ records }: { records: MemberTableRow[] }) => {
      syncSelectedUserIds(records);
    },
    checkboxChange: ({ records }: { records: MemberTableRow[] }) => {
      syncSelectedUserIds(records);
    },
  },
  gridOptions: memberGridOptions,
});

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  class: 'w-full max-w-[1280px]',
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    const row = drawerApi.getData<OrganizationItem>();
    currentOrganization.value = row;
    drawerApi.setState({
      title: `组织成员 - ${row.name ?? ''}`,
    });
    await loadMembers(row);
  },
  placement: 'right',
});

function normalizeMemberUserIds(items: OrganizationMemberItem[]) {
  return items
    .map((item) => item.userId)
    .filter((userId): userId is string => !!userId);
}

function setCurrentMembers(items: OrganizationMemberItem[]) {
  currentMembers.value = normalizeOrganizationMembers(items);
  currentMemberIds.value = normalizeMemberUserIds(items);
}

async function syncMemberGrid() {
  memberGridApi.setGridOptions({
    data: pagedMembers.value,
  });
  await nextTick();
  const grid = memberGridApi.grid;
  if (!grid) {
    return;
  }
  grid.clearCheckboxRow?.();
  const records = pagedMembers.value.filter((item) =>
    selectedUserIds.value.includes(item.userId),
  );
  if (records.length > 0) {
    grid.setCheckboxRow?.(records, true);
  }
}

function syncSelectedUserIds(records: MemberTableRow[]) {
  const currentPageUserIds = new Set(
    pagedMembers.value.map((item) => item.userId),
  );
  const next = new Set(
    selectedUserIds.value.filter((userId) => !currentPageUserIds.has(userId)),
  );
  for (const item of records) {
    next.add(item.userId);
  }
  selectedUserIds.value = [...next];
}

async function loadMembers(row: OrganizationItem) {
  drawerLoading.value = true;
  memberSearchInput.value = '';
  memberSearchKeyword.value = '';
  memberScope.value = 'all';
  memberPage.currentPage = 1;
  selectedUserIds.value = [];
  defaultMembers.value = [];
  currentMembers.value = [];
  currentMemberIds.value = [];
  defaultOrganizationId.value = '';
  try {
    const myOrganizationsReply = await getMyOrganizations();
    const defaultOrganization = myOrganizationsReply.items.find(
      (item) => item.code === DEFAULT_ORGANIZATION_CODE,
    );
    if (!defaultOrganization?.id) {
      throw new Error('未找到默认组织');
    }
    defaultOrganizationId.value = defaultOrganization.id;
    const [defaultReply, currentReply] = await Promise.all([
      getOrganizationMembers(defaultOrganization.id),
      getOrganizationMembers(row.id || ''),
    ]);
    defaultMembers.value = normalizeOrganizationMembers(defaultReply.items);
    setCurrentMembers(currentReply.items);
    await syncMemberGrid();
  } catch (error) {
    drawerApi.close();
    message.error((error as Error)?.message || '加载组织成员失败');
  } finally {
    drawerLoading.value = false;
  }
}

function applyMemberSearch() {
  memberSearchKeyword.value = memberSearchInput.value;
  memberPage.currentPage = 1;
  selectedUserIds.value = [];
  void syncMemberGrid();
}

async function persistOrganizationMembers(
  action: 'add' | 'remove',
  successText: string,
  userIds: string[],
) {
  if (!currentOrganization.value?.id || isDefaultOrganization.value) {
    return;
  }
  memberSavingAction.value = action;
  try {
    const reply = await saveOrganizationMembers(
      currentOrganization.value.id,
      userIds,
    );
    setCurrentMembers(reply.items);
    selectedUserIds.value = [];
    message.success(successText);
    emit('success');
    await syncMemberGrid();
  } catch (error) {
    message.error((error as Error)?.message || '保存组织成员失败');
    throw error;
  } finally {
    memberSavingAction.value = null;
  }
}

async function addSelectedMembers() {
  if (isDefaultOrganization.value || memberSavingAction.value) {
    return;
  }
  let nextIds = [...currentMemberIds.value];
  for (const userId of selectedUserIds.value) {
    const row = tableRows.value.find((item) => item.userId === userId);
    if (!row || row.inCurrentOrganization) {
      continue;
    }
    nextIds = appendOrganizationMemberId(nextIds, userId);
  }
  await persistOrganizationMembers('add', '已移入当前组织', nextIds);
}

function removeSelectedMembers() {
  if (isDefaultOrganization.value || memberSavingAction.value) {
    return;
  }
  let nextIds = [...currentMemberIds.value];
  let removeCount = 0;
  for (const userId of selectedUserIds.value) {
    const row = tableRows.value.find((item) => item.userId === userId);
    if (!row?.inCurrentOrganization) {
      continue;
    }
    nextIds = removeOrganizationMemberId(nextIds, userId);
    removeCount++;
  }
  if (removeCount === 0) {
    return;
  }
  Modal.confirm({
    cancelText: '取消',
    content: `将从${currentOrganization.value?.name || '当前组织'}移出 ${removeCount} 名成员，并同步清理该组织下的角色权限`,
    okButtonProps: {
      danger: true,
    },
    okText: '确定移出',
    title: '确认移出组织成员？',
    async onOk() {
      await persistOrganizationMembers('remove', '已移出当前组织', nextIds);
    },
  });
}

function onMemberPageChange(page: number, pageSize: number) {
  memberPage.currentPage = page;
  memberPage.pageSize = pageSize;
  void syncMemberGrid();
}

watch(memberScope, () => {
  memberSearchKeyword.value = memberSearchInput.value;
  memberPage.currentPage = 1;
  selectedUserIds.value = [];
  void syncMemberGrid();
});

watch(memberSearchInput, (value, previousValue) => {
  if (value || !previousValue) {
    return;
  }
  applyMemberSearch();
});

watch(
  () => currentMemberIds.value,
  () => {
    void syncMemberGrid();
  },
);

const currentMemberCount = computed(
  () => collectOrganizationMemberIds(currentMembers.value).length,
);
</script>

<template>
  <Drawer :title="`组织成员 - ${currentOrganization?.name || ''}`">
    <Spin :spinning="drawerLoading || !!memberSavingAction">
      <div class="flex h-full flex-col gap-4">
        <div class="rounded-lg border border-border bg-card p-4">
          <div
            class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
          >
            <div>
              <div class="text-base font-medium">成员管理</div>
              <div class="text-muted-foreground text-sm">
                全部成员来自默认组织，共
                {{ defaultMembers.length }} 人；当前组织共
                {{ currentMemberCount }} 人
              </div>
            </div>
            <div
              class="flex flex-none items-center gap-3 self-start xl:self-center"
            >
              <RadioGroup
                v-model:value="memberScope"
                button-style="solid"
                class="shrink-0 whitespace-nowrap"
                option-type="button"
                :options="scopeOptions"
              />
              <Input
                v-model:value="memberSearchInput"
                allow-clear
                class="w-52"
                placeholder="输入昵称，或邮箱，或 id:用户ID"
                @clear="applyMemberSearch"
                @press-enter="applyMemberSearch"
              />
            </div>
          </div>
        </div>

        <div
          class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="text-muted-foreground text-sm">
            当前筛选共 {{ filteredMembers.length }} 人，已选
            {{ selectedCount }} 人
          </div>
          <div class="flex flex-wrap gap-3">
            <Button
              v-if="!isViewingCurrentOrganization"
              type="primary"
              :disabled="
                isDefaultOrganization ||
                !!memberSavingAction ||
                selectedAvailableCount === 0
              "
              :loading="memberSavingAction === 'add'"
              @click="addSelectedMembers"
            >
              移入当前组织
            </Button>
            <Button
              v-else
              danger
              :disabled="
                isDefaultOrganization ||
                !!memberSavingAction ||
                selectedCurrentCount === 0
              "
              :loading="memberSavingAction === 'remove'"
              @click="removeSelectedMembers"
            >
              移出当前组织
            </Button>
          </div>
        </div>

        <div
          class="flex min-h-0 flex-1 flex-col rounded-lg border border-border bg-card p-4"
        >
          <MemberGrid v-if="filteredMembers.length > 0">
            <template #member-badge="{ row }">
              <Tag :color="row.inCurrentOrganization ? 'success' : 'default'">
                {{ row.inCurrentOrganization ? '已加入' : '未加入' }}
              </Tag>
            </template>
            <template #status="{ row }">
              <Tag :color="row.status === 1 ? 'success' : 'default'">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </Tag>
            </template>
          </MemberGrid>
          <Empty v-else class="my-auto" description="当前筛选下暂无成员" />
          <div class="mt-3 flex items-center justify-between text-sm">
            <span class="text-muted-foreground">成员列表</span>
            <Pagination
              v-model:current="memberPage.currentPage"
              v-model:page-size="memberPage.pageSize"
              size="small"
              :show-size-changer="true"
              :total="filteredMembers.length"
              @change="onMemberPageChange"
            />
          </div>
        </div>
      </div>
    </Spin>
  </Drawer>
</template>
