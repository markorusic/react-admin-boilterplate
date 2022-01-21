import { Tag } from 'antd'
import React from 'react'
import { UserRole } from '../../core/auth'
import {
  useTextFilterColumn,
  PageableTableProps,
  PageableTable
} from '../../core/table'
import { formatDate } from '../../core/utils/date'
import { UserRequest, UserResponse, UserStatus } from './types'

export type UserTableProps = PageableTableProps<UserResponse, UserRequest>

let userRoleColor: Record<UserRole, string> = {
  [UserRole.admin]: 'purple',
  [UserRole.superAdmin]: 'blue'
}

let userStatusColor: Record<UserStatus, string> = {
  [UserStatus.active]: 'green',
  [UserStatus.inactive]: 'red'
}

export let UserTable = (props: UserTableProps) => {
  return (
    <PageableTable
      {...props}
      columns={[
        useTextFilterColumn({
          name: 'id',
          title: 'common.id',
          sorter: true,
          width: 100
        }),
        useTextFilterColumn({
          name: 'name',
          title: 'common.name',
          sorter: true
        }),
        useTextFilterColumn({
          name: 'email',
          title: 'common.email',
          sorter: true
        }),
        {
          name: 'role',
          title: 'common.role',
          sorter: true,
          // filterSearch: true,
          filterMultiple: false,
          filters: Object.values(UserRole).map(value => ({
            value,
            text: value
          })),
          render: (_, user) => (
            <Tag color={userRoleColor[user.role]}>{user.role}</Tag>
          )
        },
        {
          name: 'status',
          title: 'common.status',
          sorter: true,
          filterMultiple: false,
          filters: Object.values(UserStatus).map(value => ({
            value,
            text: value
          })),
          render: (_, user) => (
            <Tag color={userStatusColor[user.status]}>{user.status}</Tag>
          )
        },
        {
          name: 'createdAt',
          title: 'common.createdAt',
          sorter: true,
          render: formatDate
        }
      ]}
    />
  )
}
