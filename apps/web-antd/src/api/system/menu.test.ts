import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  adminServiceIsMenuNameExists: vi.fn(),
  adminServiceIsMenuPathExists: vi.fn(),
  requestGet: vi.fn(),
}));

vi.mock('#/api/generated', () => ({
  AdminServiceService: {
    adminServiceIsMenuNameExists: mocks.adminServiceIsMenuNameExists,
    adminServiceIsMenuPathExists: mocks.adminServiceIsMenuPathExists,
  },
}));

vi.mock('#/api/request', () => ({
  requestClient: {
    delete: vi.fn(),
    get: mocks.requestGet,
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('system menu api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('unwraps name existence reply to boolean', async () => {
    mocks.adminServiceIsMenuNameExists.mockResolvedValue({ data: false });
    const { isMenuNameExists } = await import('./menu');

    await expect(isMenuNameExists('test', 1)).resolves.toBe(false);
    expect(mocks.adminServiceIsMenuNameExists).toHaveBeenCalledWith({
      id: '1',
      name: 'test',
    });
  });

  it('unwraps path existence reply to boolean', async () => {
    mocks.adminServiceIsMenuPathExists.mockResolvedValue({ data: true });
    const { isMenuPathExists } = await import('./menu');

    await expect(isMenuPathExists('/test', 1)).resolves.toBe(true);
    expect(mocks.adminServiceIsMenuPathExists).toHaveBeenCalledWith({
      id: '1',
      path: '/test',
    });
  });
});
