import { describe, expect, it } from 'vitest';

import {
  appendUserId,
  filterUsersByQuery,
  getNewUserOrganizationIds,
  mergeRoleIds,
  organizationMemberToUserListItem,
  paginateUsers,
} from './helpers';

describe('system user organization helpers', () => {
  it('maps organization members into user list rows', () => {
    expect(
      organizationMemberToUserListItem({
        avatar: '/avatar.png',
        createTime: '2026-05-13 10:00:00',
        email: 'ann@example.com',
        nickname: 'Ann',
        userId: 'user-1',
        username: 'ann',
        userStatus: 1,
      }),
    ).toEqual({
      avatar: '/avatar.png',
      createTime: '2026-05-13 10:00:00',
      create_time: '2026-05-13 10:00:00',
      dept: '',
      deptId: undefined,
      email: 'ann@example.com',
      id: 'user-1',
      nickname: 'Ann',
      remark: '',
      status: 1,
      username: 'ann',
    });
  });

  it('filters rows by user fields inside the organization member set', () => {
    const users = [
      {
        create_time: '',
        email: '',
        id: 'user-1',
        nickname: 'Ann',
        remark: '',
        status: 1,
        username: 'ann',
      },
      {
        create_time: '',
        email: '',
        id: 'user-2',
        nickname: 'Ben',
        remark: '',
        status: 0,
        username: 'ben',
      },
    ];

    expect(filterUsersByQuery(users, { nickname: 'Ann', status: '1' })).toEqual(
      [users[0]],
    );
    expect(filterUsersByQuery(users, { nickname: 'An' })).toEqual([]);
    expect(filterUsersByQuery(users, { status: '2' })).toEqual([users[1]]);
  });

  it('paginates filtered rows', () => {
    const users = Array.from({ length: 5 }, (_, index) => ({
      create_time: '',
      email: '',
      id: `user-${index + 1}`,
      nickname: '',
      remark: '',
      status: 1,
      username: `user-${index + 1}`,
    }));

    expect(paginateUsers(users, { currentPage: 2, pageSize: 2 })).toEqual([
      users[2],
      users[3],
    ]);
  });

  it('always includes the default organization for newly created users', () => {
    expect(
      getNewUserOrganizationIds({
        currentOrganizationId: 'org-current',
        defaultOrganizationId: 'org-default',
      }),
    ).toEqual(['org-default', 'org-current']);

    expect(
      getNewUserOrganizationIds({
        currentOrganizationId: 'org-default',
        defaultOrganizationId: 'org-default',
      }),
    ).toEqual(['org-default']);
  });

  it('adds a user id to an existing membership set', () => {
    expect(appendUserId(['user-1', undefined, ' user-2 '], 'user-3')).toEqual([
      'user-1',
      'user-2',
      'user-3',
    ]);
    expect(appendUserId(['user-1'], 'user-1')).toEqual(['user-1']);
  });

  it('merges selected roles with required default roles', () => {
    expect(mergeRoleIds([2, '3'], ['0', undefined, 2])).toEqual([2, 3, 0]);
    expect(mergeRoleIds(undefined, ['0'])).toEqual([0]);
  });
});
