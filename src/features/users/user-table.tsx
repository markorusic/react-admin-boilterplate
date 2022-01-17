import React from 'react'
import { Table, TableProps, useTextFilter } from '../../core/table'
import { formatDate } from '../../core/utils/date'
import { UserResponse } from './types'

export type UserTableProps = TableProps<UserResponse>

export let UserTable = (props: UserTableProps) => {
  return (
    <Table
      {...props}
      columns={[
        useTextFilter<UserResponse>({
          name: 'id',
          title: 'common.id',
          width: 100
        }),
        useTextFilter<UserResponse>({
          name: 'name',
          title: 'common.name'
        }),
        useTextFilter<UserResponse>({
          name: 'email',
          title: 'common.email'
        }),
        {
          name: 'createdAt',
          title: 'common.createdAt',
          render: formatDate
        }
      ]}
    />
  )
}
