import { describe, expect, it } from 'vitest';

import {
  appendOrganizationMemberId,
  collectOrganizationMemberIds,
  filterOrganizationMembers,
  markCurrentOrganizationMembers,
  normalizeOrganizationMembers,
  paginateOrganizationMembers,
  removeOrganizationMemberId,
} from './helpers';

describe('organization member helpers', () => {
  it('normalizes organization member rows', () => {
    expect(
      normalizeOrganizationMembers([
        {
          avatar: '/avatar.png',
          createTime: '2026-05-14 09:00:00',
          email: 'ann@example.com',
          memberStatus: 1,
          nickname: 'Ann',
          primary: true,
          userId: 'user-1',
          userStatus: 1,
          username: 'ann',
        },
        {
          userId: '',
        },
      ]),
    ).toEqual([
      {
        avatar: '/avatar.png',
        createTime: '2026-05-14 09:00:00',
        email: 'ann@example.com',
        memberStatus: 1,
        nickname: 'Ann',
        primary: true,
        status: 1,
        userId: 'user-1',
        username: 'ann',
      },
    ]);
  });

  it('filters members by username nickname or email', () => {
    const rows = [
      {
        avatar: '',
        createTime: '',
        email: 'ann@example.com',
        memberStatus: 1,
        nickname: 'Ann',
        primary: false,
        status: 1,
        userId: 'user-1',
        username: 'ann',
      },
      {
        avatar: '',
        createTime: '',
        email: 'ben@example.com',
        memberStatus: 1,
        nickname: 'Ben',
        primary: false,
        status: 1,
        userId: 'user-2',
        username: 'ben',
      },
    ];

    expect(filterOrganizationMembers(rows, 'Ann')).toEqual([rows[0]]);
    expect(filterOrganizationMembers(rows, 'ben')).toEqual([rows[1]]);
    expect(filterOrganizationMembers(rows, 'ben@example.com')).toEqual([
      rows[1],
    ]);
    expect(filterOrganizationMembers(rows, 'id:user-2')).toEqual([rows[1]]);
    expect(filterOrganizationMembers(rows, '')).toEqual(rows);
  });

  it('paginates member rows', () => {
    const rows = Array.from({ length: 5 }, (_, index) => ({
      avatar: '',
      createTime: '',
      email: '',
      memberStatus: 1,
      nickname: '',
      primary: false,
      status: 1,
      userId: `user-${index + 1}`,
      username: `user-${index + 1}`,
    }));

    expect(
      paginateOrganizationMembers(rows, { currentPage: 2, pageSize: 2 }),
    ).toEqual([rows[2], rows[3]]);
  });

  it('collects trimmed member ids', () => {
    expect(
      collectOrganizationMemberIds([
        { userId: ' user-1 ' },
        { userId: 'user-2' },
      ]),
    ).toEqual(['user-1', 'user-2']);
  });

  it('adds and removes member ids without duplicates', () => {
    expect(
      appendOrganizationMemberId(['user-1', ' user-2 '], 'user-3'),
    ).toEqual(['user-1', 'user-2', 'user-3']);
    expect(appendOrganizationMemberId(['user-1'], 'user-1')).toEqual([
      'user-1',
    ]);
    expect(
      removeOrganizationMemberId(['user-1', ' user-2 '], 'user-1'),
    ).toEqual(['user-2']);
    expect(removeOrganizationMemberId(['user-1', 'user-2'], 'user-2')).toEqual([
      'user-1',
    ]);
  });

  it('marks rows that already belong to the current organization', () => {
    expect(
      markCurrentOrganizationMembers(
        [
          {
            avatar: '',
            createTime: '',
            email: '',
            memberStatus: 1,
            nickname: 'Ann',
            primary: false,
            status: 1,
            userId: 'user-1',
            username: 'ann',
          },
          {
            avatar: '',
            createTime: '',
            email: '',
            memberStatus: 1,
            nickname: 'Ben',
            primary: false,
            status: 1,
            userId: 'user-2',
            username: 'ben',
          },
        ],
        ['user-2'],
      ),
    ).toEqual([
      expect.objectContaining({
        inCurrentOrganization: false,
        userId: 'user-1',
      }),
      expect.objectContaining({
        inCurrentOrganization: true,
        userId: 'user-2',
      }),
    ]);
  });
});
