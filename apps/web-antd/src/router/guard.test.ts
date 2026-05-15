import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  accessStore: {
    accessMenus: [] as unknown[],
    accessRoutes: [] as unknown[],
    accessToken: 'access-token',
    isAccessChecked: true,
    setAccessMenus: vi.fn(),
    setAccessRoutes: vi.fn(),
    setIsAccessChecked: vi.fn(),
  },
  authStore: {
    fetchUserInfo: vi.fn(),
  },
  generateAccess: vi.fn(),
  messageError: vi.fn(),
  organizationStore: {
    loadMyOrganizations: vi.fn(),
    organizations: [{ id: 'org-1' }],
  },
  resetStaticRoutes: vi.fn(),
  startProgress: vi.fn(),
  stopProgress: vi.fn(),
  userStore: {
    userInfo: {
      homePath: '/dashboard',
      roles: ['admin'],
    },
  },
}));

vi.mock('@vben/constants', () => ({
  LOGIN_PATH: '/auth/login',
}));

vi.mock('@vben/preferences', () => ({
  preferences: {
    app: {
      defaultHomePath: '/analytics',
    },
    transition: {
      progress: false,
    },
  },
}));

vi.mock('@vben/stores', () => ({
  useAccessStore: () => mocks.accessStore,
  useUserStore: () => mocks.userStore,
}));

vi.mock('@vben/utils', () => ({
  resetStaticRoutes: mocks.resetStaticRoutes,
  startProgress: mocks.startProgress,
  stopProgress: mocks.stopProgress,
}));

vi.mock('ant-design-vue', () => ({
  message: {
    error: mocks.messageError,
  },
}));

vi.mock('#/locales', () => ({
  $t: (key: string) => key,
}));

vi.mock('#/router/routes', () => ({
  accessRoutes: [{ name: 'System', path: '/system' }],
  coreRouteNames: ['Login'],
  routes: [
    { name: 'Root', path: '/' },
    { name: 'FallbackNotFound', path: '/:path(.*)*' },
  ],
}));

vi.mock('#/store', () => ({
  useAuthStore: () => mocks.authStore,
  useOrganizationStore: () => mocks.organizationStore,
}));

vi.mock('./access', () => ({
  generateAccess: mocks.generateAccess,
}));

import { createRouterGuard, rebuildAccessRoutes } from './guard';

function createRouter() {
  return {
    addRoute: vi.fn(),
    afterEach: vi.fn(),
    beforeEach: vi.fn(),
    getRoutes: vi.fn(() => []),
    hasRoute: vi.fn(() => false),
    removeRoute: vi.fn(),
    resolve: vi.fn((path: string) => ({ path })),
  };
}

describe('router guard access rebuild', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.accessStore.accessMenus = [{ name: 'OldMenu' }];
    mocks.accessStore.accessRoutes = [{ name: 'OldRoute' }];
    mocks.accessStore.accessToken = 'access-token';
    mocks.accessStore.isAccessChecked = true;
    mocks.accessStore.setAccessMenus.mockImplementation((menus) => {
      mocks.accessStore.accessMenus = menus;
    });
    mocks.accessStore.setAccessRoutes.mockImplementation((routes) => {
      mocks.accessStore.accessRoutes = routes;
    });
    mocks.accessStore.setIsAccessChecked.mockImplementation((checked) => {
      mocks.accessStore.isAccessChecked = checked;
    });
    mocks.authStore.fetchUserInfo.mockResolvedValue(mocks.userStore.userInfo);
    mocks.generateAccess.mockResolvedValue({
      accessibleMenus: [{ name: 'NewMenu', path: '/system/user' }],
      accessibleRoutes: [{ name: 'NewRoute', path: '/system/user' }],
    });
    mocks.organizationStore.organizations = [{ id: 'org-1' }];
  });

  it('rebuilds access menus and dynamic routes after organization switching invalidates them', async () => {
    const router = createRouter();
    createRouterGuard(router as any);

    await rebuildAccessRoutes();

    expect(mocks.resetStaticRoutes).toHaveBeenCalledWith(router, [
      { name: 'Root', path: '/' },
      { name: 'FallbackNotFound', path: '/:path(.*)*' },
    ]);
    expect(mocks.accessStore.setAccessMenus).toHaveBeenNthCalledWith(1, []);
    expect(mocks.accessStore.setAccessRoutes).toHaveBeenNthCalledWith(1, []);
    expect(mocks.accessStore.setIsAccessChecked).toHaveBeenNthCalledWith(
      1,
      false,
    );
    expect(mocks.generateAccess).toHaveBeenCalledWith(
      expect.objectContaining({
        roles: ['admin'],
        router,
        routes: [{ name: 'System', path: '/system' }],
      }),
    );
    expect(mocks.accessStore.setAccessMenus).toHaveBeenLastCalledWith([
      { name: 'NewMenu', path: '/system/user' },
    ]);
    expect(mocks.accessStore.setAccessRoutes).toHaveBeenLastCalledWith([
      { name: 'NewRoute', path: '/system/user' },
    ]);
    expect(mocks.accessStore.setIsAccessChecked).toHaveBeenLastCalledWith(true);
  });

  it('loads organizations before rebuilding access when the organization store is empty', async () => {
    const router = createRouter();
    mocks.organizationStore.organizations = [];
    createRouterGuard(router as any);

    await rebuildAccessRoutes();

    expect(mocks.organizationStore.loadMyOrganizations).toHaveBeenCalledTimes(
      1,
    );
    expect(mocks.generateAccess).toHaveBeenCalledTimes(1);
  });
});
