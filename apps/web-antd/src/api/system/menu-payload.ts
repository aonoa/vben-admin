import type { SystemMenuApi } from './menu';

export type MenuFormValues = Omit<
  SystemMenuApi.SystemMenu,
  'children' | 'id'
> & {
  authorityText?: string;
};

function toNumber(value: unknown, defaultValue = 0): number {
  const result = Number(value ?? defaultValue);
  return Number.isFinite(result) ? result : defaultValue;
}

function normalizeBoolean(value: unknown, defaultValue = false): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  return defaultValue;
}

function normalizeOptionalString(value: unknown): string | undefined {
  const result = String(value ?? '').trim();
  return result.length > 0 ? result : undefined;
}

export function normalizeAuthorityText(value: unknown): string[] {
  if (Array.isArray(value)) {
    return [
      ...new Set(
        value
          .map((item) => String(item ?? '').trim())
          .filter((item) => item.length > 0),
      ),
    ];
  }

  return [
    ...new Set(
      String(value ?? '')
        .split(/[\s,，]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    ),
  ];
}

export function toMenuFormValues(
  data: Partial<SystemMenuApi.SystemMenu> | undefined,
): Partial<MenuFormValues> {
  const meta = data?.meta ?? {};
  const authority = normalizeAuthorityText(meta.authority ?? data?.authCode);
  let linkSrc = data?.linkSrc;
  if (data?.type === 'link') {
    linkSrc = meta.link;
  } else if (data?.type === 'embedded') {
    linkSrc = meta.iframeSrc;
  }
  return {
    ...data,
    authorityText: authority.join(','),
    linkSrc,
    meta: {
      ...meta,
      activePath: normalizeOptionalString(meta.activePath),
      affixTabOrder: toNumber(meta.affixTabOrder),
      fullPathKey: meta.fullPathKey ?? true,
      maxNumOfOpenTab: toNumber(meta.maxNumOfOpenTab, -1),
      order: toNumber(meta.order),
    },
  };
}

export function pickMenuMutationPayload(
  values: MenuFormValues,
): Omit<SystemMenuApi.SystemMenu, 'children' | 'id'> {
  const meta = values.meta ?? {};
  const authority = normalizeAuthorityText(values.authorityText);
  const payload: Omit<SystemMenuApi.SystemMenu, 'children' | 'id'> = {
    authCode: authority.join(','),
    component: values.component ?? '',
    meta: {
      ...meta,
      affixTab: normalizeBoolean(meta.affixTab),
      affixTabOrder: toNumber(meta.affixTabOrder),
      authority,
      fullPathKey: meta.fullPathKey ?? true,
      hideChildrenInMenu: normalizeBoolean(meta.hideChildrenInMenu),
      hideInBreadcrumb: normalizeBoolean(meta.hideInBreadcrumb),
      hideInMenu: normalizeBoolean(meta.hideInMenu),
      hideInTab: normalizeBoolean(meta.hideInTab),
      ignoreAccess: normalizeBoolean(meta.ignoreAccess),
      keepAlive: normalizeBoolean(meta.keepAlive),
      maxNumOfOpenTab: toNumber(meta.maxNumOfOpenTab, -1),
      menuVisibleWithForbidden: normalizeBoolean(meta.menuVisibleWithForbidden),
      noBasicLayout: normalizeBoolean(meta.noBasicLayout),
      openInNewWindow: normalizeBoolean(meta.openInNewWindow),
      order: toNumber(meta.order),
    },
    name: values.name ?? '',
    path: values.path ?? '',
    pid: values.pid ?? 0,
    redirect: values.redirect ?? '',
    status: toNumber(values.status, 0),
    type: values.type,
  };

  if (values.type === 'link') {
    payload.meta = {
      ...payload.meta,
      iframeSrc: '',
      link: values.linkSrc ?? '',
    };
  } else if (values.type === 'embedded') {
    payload.meta = {
      ...payload.meta,
      iframeSrc: values.linkSrc ?? '',
      link: '',
    };
  } else {
    payload.meta = {
      ...payload.meta,
      iframeSrc: meta.iframeSrc ?? '',
      link: meta.link ?? '',
    };
  }

  return payload;
}
