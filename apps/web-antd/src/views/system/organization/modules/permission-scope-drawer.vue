<script lang="ts" setup>
import type { DataNode } from 'ant-design-vue/es/tree';

import type { Recordable } from '@vben/types';

import type {
  OrganizationItem,
  OrganizationPermissionResource,
} from '#/api/system/organization';

import { computed, nextTick, ref } from 'vue';

import { Tree, useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button, Empty, message, Spin, Tabs, Tag } from 'ant-design-vue';

import { getMenuList } from '#/api/system/menu';
import {
  getOrganizationPermissionScope,
  saveOrganizationPermissionScope,
} from '#/api/system/organization';
import { GetResourceList } from '#/api/system/resource';
import { $t } from '#/locales';

const emit = defineEmits<{
  success: [];
}>();

const currentOrganization = ref<OrganizationItem>();
const drawerLoading = ref(false);
const saving = ref(false);
const menus = ref<DataNode[]>([]);
const resources = ref<OrganizationPermissionResource[]>([]);
const menuIds = ref<number[]>([]);
const resourceIds = ref<string[]>([]);

const menuCount = computed(() => countTreeNodes(menus.value));
const resourceCount = computed(() => resources.value.length);

const resourceTreeData = computed<DataNode[]>(
  () =>
    resources.value.map((item) => ({
      ...item,
      title: item.name || item.value || item.id,
    })) as DataNode[],
);

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  class: 'w-full max-w-[1040px]',
  async onConfirm() {
    await savePermissionScope();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    const row = drawerApi.getData<OrganizationItem>();
    currentOrganization.value = row;
    drawerApi.setState({
      title: `权限范围 - ${row.name ?? ''}`,
    });
    await loadPermissionScope(row);
  },
  placement: 'right',
});

async function loadPermissionScope(row: OrganizationItem) {
  if (!row.id) {
    message.error('组织 ID 不能为空');
    drawerApi.close();
    return;
  }
  drawerLoading.value = true;
  menus.value = [];
  resources.value = [];
  menuIds.value = [];
  resourceIds.value = [];
  try {
    const [menuList, resourceReply, scope] = await Promise.all([
      getMenuList(),
      GetResourceList({}),
      getOrganizationPermissionScope(row.id),
    ]);
    const menuItems = Array.isArray(menuList)
      ? menuList
      : ((menuList as undefined | { items?: unknown[] })?.items ?? []);
    menus.value = menuItems as unknown as DataNode[];
    resources.value = (resourceReply.items ??
      []) as OrganizationPermissionResource[];
    menuIds.value = scope.menuIds ?? [];
    resourceIds.value = scope.resourceIds ?? [];
    await nextTick();
  } catch (error) {
    message.error((error as Error)?.message || '加载组织权限范围失败');
    drawerApi.close();
  } finally {
    drawerLoading.value = false;
  }
}

async function savePermissionScope() {
  if (!currentOrganization.value?.id || saving.value) {
    return;
  }
  saving.value = true;
  drawerApi.lock();
  try {
    await saveOrganizationPermissionScope(currentOrganization.value.id, {
      menuIds: menuIds.value,
      resourceIds: resourceIds.value,
    });
    message.success('权限范围已保存');
    emit('success');
    drawerApi.close();
  } catch (error) {
    message.error((error as Error)?.message || '保存组织权限范围失败');
    drawerApi.unlock();
  } finally {
    saving.value = false;
  }
}

function getMenuNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.type === 'button') {
    classes.push('inline-flex');
    if (node.index % 3 >= 1) {
      classes.push('!pl-0');
    }
  }
  return classes.join(' ');
}

function countTreeNodes(items: DataNode[]) {
  let count = 0;
  for (const item of items) {
    count++;
    const children = (item.children ?? []) as DataNode[];
    count += countTreeNodes(children);
  }
  return count;
}
</script>

<template>
  <Drawer :title="`权限范围 - ${currentOrganization?.name || ''}`">
    <Spin :spinning="drawerLoading || saving">
      <div class="flex h-full min-h-[520px] flex-col gap-4">
        <div class="rounded-lg border border-border bg-card p-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div class="text-base font-medium">组织可用权限</div>
              <div class="text-muted-foreground text-sm">
                已选菜单 {{ menuIds.length }} / {{ menuCount }}，已选 API 资源
                {{ resourceIds.length }} / {{ resourceCount }}
              </div>
            </div>
            <Button
              type="primary"
              :loading="saving"
              @click="savePermissionScope"
            >
              保存权限范围
            </Button>
          </div>
        </div>

        <Tabs class="min-h-0 flex-1" type="card">
          <Tabs.TabPane key="menus" tab="菜单范围">
            <div
              class="h-[560px] overflow-auto rounded-lg border border-border bg-card p-4"
            >
              <Tree
                v-if="menus.length > 0"
                v-model="menuIds"
                :tree-data="menus"
                multiple
                bordered
                :default-expanded-level="2"
                :get-node-class="getMenuNodeClass"
                value-field="id"
                label-field="meta.title"
                icon-field="meta.icon"
              >
                <template #node="{ value }">
                  <IconifyIcon
                    v-if="value.meta?.icon"
                    class="size-4"
                    :icon="value.meta.icon"
                  />
                  {{ $t(value.meta?.title || value.name || value.path || '') }}
                </template>
              </Tree>
              <Empty v-else class="my-20" description="暂无菜单" />
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane key="resources" tab="API 资源范围">
            <div
              class="h-[560px] overflow-auto rounded-lg border border-border bg-card p-4"
            >
              <Tree
                v-if="resourceTreeData.length > 0"
                v-model="resourceIds"
                :tree-data="resourceTreeData"
                multiple
                bordered
                :default-expanded-level="1"
                value-field="id"
                label-field="title"
              >
                <template #node="{ value }">
                  <span>{{ value.name || value.value || value.id }}</span>
                  <Tag v-if="value.method" class="ml-2" color="blue">
                    {{ value.method }}
                  </Tag>
                  <span
                    v-if="value.description"
                    class="text-muted-foreground ml-2 text-xs"
                  >
                    {{ value.description }}
                  </span>
                </template>
              </Tree>
              <Empty v-else class="my-20" description="暂无 API 资源" />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Spin>
  </Drawer>
</template>
