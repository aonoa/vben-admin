import { describe, expect, it } from 'vitest';

import {
  normalizeRoleFormValues,
  pickRoleMutationPayload,
} from './role-payload';

describe('role mutation payload', () => {
  it('keeps only backend proto-name fields for requests', () => {
    expect(
      pickRoleMutationPayload({
        apiPermissions: ['camel-api'],
        api_permissions: ['snake-api'],
        createTime: '2026-05-15 10:00:00',
        dataScope: 'all',
        data_scope: 'custom_depts',
        dataScopeDeptIds: ['99'],
        data_scope_dept_ids: ['1', '2'],
        id: '1',
        name: '管理员',
        organizationId: 'camel-org',
        organization_id: 'snake-org',
        permissions: ['1', '2'],
        remark: 'remark',
        status: 1,
        value: 'admin',
      }),
    ).toEqual({
      api_permissions: ['snake-api'],
      data_scope: 'custom_depts',
      data_scope_dept_ids: ['1', '2'],
      name: '管理员',
      organization_id: 'snake-org',
      permissions: [1, 2],
      remark: 'remark',
      status: 1,
      value: 'admin',
    });
  });

  it('clears custom department ids unless data scope is custom_depts', () => {
    expect(
      pickRoleMutationPayload({
        data_scope: 'self_dept',
        data_scope_dept_ids: ['1'],
      }),
    ).toMatchObject({
      data_scope: 'self_dept',
      data_scope_dept_ids: [],
    });
  });

  it('normalizes camelCase list data into form fields', () => {
    expect(
      normalizeRoleFormValues({
        apiPermissions: ['api'],
        dataScope: 'self',
        dataScopeDeptIds: ['3'],
        organizationId: 'org-a',
      }),
    ).toMatchObject({
      api_permissions: ['api'],
      data_scope: 'self',
      data_scope_dept_ids: ['3'],
      organization_id: 'org-a',
    });
  });
});
