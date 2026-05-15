import { describe, expect, it } from 'vitest';

import {
  normalizeOrganizationPermissionScope,
  pickOrganizationMutationPayload,
  pickOrganizationPermissionScopePayload,
} from './organization-payload';

describe('organization mutation payload', () => {
  it('keeps only editable camelCase fields for requests', () => {
    expect(
      pickOrganizationMutationPayload({
        code: 'ops',
        createTime: '2026-05-14 15:00:00',
        id: 'org-1',
        name: '运营组织',
        orderNo: 12,
        order_no: 99,
        remark: 'remark',
        status: 1,
        updateTime: '2026-05-14 15:01:00',
      }),
    ).toEqual({
      code: 'ops',
      name: '运营组织',
      orderNo: 12,
      remark: 'remark',
      status: 1,
    });
  });

  it('normalizes organization permission scope responses', () => {
    expect(
      normalizeOrganizationPermissionScope({
        menu_ids: [2, '1', 2, 0],
        organization_id: 'org-a',
        resource_ids: [' resource-b ', '', 'resource-a', 'resource-b'],
      }),
    ).toEqual({
      menuIds: [1, 2],
      organizationId: 'org-a',
      resourceIds: ['resource-a', 'resource-b'],
    });
  });

  it('keeps only proto-name scope fields for permission-scope requests', () => {
    expect(
      pickOrganizationPermissionScopePayload('org-a', {
        menuIds: [3, 1, 3],
        resourceIds: ['resource-b', 'resource-a', 'resource-b'],
      }),
    ).toEqual({
      menuIds: [1, 3],
      organizationId: 'org-a',
      resourceIds: ['resource-a', 'resource-b'],
    });
  });
});
