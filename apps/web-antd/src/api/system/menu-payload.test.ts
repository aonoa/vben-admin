import { describe, expect, it } from 'vitest';

import {
  normalizeAuthorityText,
  pickMenuMutationPayload,
  toMenuFormValues,
} from './menu-payload';

describe('menu mutation payload', () => {
  it('normalizes authority text from comma and whitespace separated input', () => {
    expect(normalizeAuthorityText(' admin, operator，viewer admin ')).toEqual([
      'admin',
      'operator',
      'viewer',
    ]);
  });

  it('prepares form values from persisted authority and link fields', () => {
    expect(
      toMenuFormValues({
        authCode: 'legacy',
        meta: {
          activePath: '',
          authority: ['admin', 'operator'],
          link: 'https://example.com',
        },
        type: 'link',
      }),
    ).toMatchObject({
      authorityText: 'admin,operator',
      linkSrc: 'https://example.com',
      meta: {
        activePath: undefined,
        affixTabOrder: 0,
        fullPathKey: true,
        maxNumOfOpenTab: -1,
        order: 0,
      },
    });
  });

  it('keeps all editable meta fields when creating or updating menu', () => {
    expect(
      pickMenuMutationPayload({
        authorityText: 'admin operator admin',
        component: 'views/system/menu/list',
        linkSrc: 'https://example.com/frame',
        meta: {
          activeIcon: 'carbon:home',
          activePath: '/system',
          affixTab: true,
          affixTabOrder: 5,
          badge: '9',
          badgeType: 'normal',
          badgeVariants: 'warning',
          fullPathKey: false,
          hideChildrenInMenu: true,
          hideInBreadcrumb: true,
          hideInMenu: true,
          hideInTab: true,
          icon: 'carbon:menu',
          ignoreAccess: true,
          keepAlive: true,
          maxNumOfOpenTab: 3,
          menuVisibleWithForbidden: true,
          noBasicLayout: true,
          openInNewWindow: true,
          order: 9,
          title: 'system.menu.title',
        },
        name: 'SystemMenu',
        path: '/system/menu',
        pid: 1,
        redirect: '/dashboard',
        status: 1,
        type: 'embedded',
      }),
    ).toEqual({
      authCode: 'admin,operator',
      component: 'views/system/menu/list',
      meta: {
        activeIcon: 'carbon:home',
        activePath: '/system',
        affixTab: true,
        affixTabOrder: 5,
        authority: ['admin', 'operator'],
        badge: '9',
        badgeType: 'normal',
        badgeVariants: 'warning',
        fullPathKey: false,
        hideChildrenInMenu: true,
        hideInBreadcrumb: true,
        hideInMenu: true,
        hideInTab: true,
        icon: 'carbon:menu',
        iframeSrc: 'https://example.com/frame',
        ignoreAccess: true,
        keepAlive: true,
        link: '',
        maxNumOfOpenTab: 3,
        menuVisibleWithForbidden: true,
        noBasicLayout: true,
        openInNewWindow: true,
        order: 9,
        title: 'system.menu.title',
      },
      name: 'SystemMenu',
      path: '/system/menu',
      pid: 1,
      redirect: '/dashboard',
      status: 1,
      type: 'embedded',
    });
  });

  it('uses backend-compatible defaults for fields omitted by the form', () => {
    expect(
      pickMenuMutationPayload({
        meta: {},
        name: 'Demo',
        path: '/demo',
        pid: 0,
        status: 1,
        type: 'menu',
      }),
    ).toMatchObject({
      meta: {
        affixTab: false,
        affixTabOrder: 0,
        authority: [],
        fullPathKey: true,
        maxNumOfOpenTab: -1,
        order: 0,
      },
    });
  });
});
