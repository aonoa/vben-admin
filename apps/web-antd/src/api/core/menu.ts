import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

interface GetAllMenusReply {
  items: RouteRecordStringComponent[];
}

type MenuResponse = GetAllMenusReply | RouteRecordStringComponent[];

function normalizeMenus(reply: MenuResponse): GetAllMenusReply {
  if (Array.isArray(reply)) {
    return { items: reply };
  }
  return {
    items: Array.isArray(reply?.items) ? reply.items : [],
  };
}

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  const reply = await requestClient.get<MenuResponse>(
    '/admin-api/v1/menus/current',
  );
  return normalizeMenus(reply);
}
