import React from 'react'
import { UserRole } from '../../core/auth'
import { Table, usePageableTable, useTextFilter } from '../../core/table'
import { Identifiable, Page } from '../../core/types'
import { formatDate } from '../../core/utils/date'

type UserResponseDto = Identifiable & {
  name: string
  email: string
  role: UserRole
}

let queryFn = async (): Promise<Page<UserResponseDto>> => {
  let content: UserResponseDto[] = []
  return { content, page: 0, size: 10, total: 100, pageCount: 10 }
}

export type UserTableProps = {}

export let UserTable = (props: UserTableProps) => {
  const { query, ...tableProps } = usePageableTable({
    name: 'user-table',
    queryFn
  })
  return (
    <Table
      {...tableProps}
      columns={[
        useTextFilter<UserResponseDto>({
          name: 'id',
          title: 'common.id',
          width: 100
        }),
        useTextFilter<UserResponseDto>({
          name: 'name',
          title: 'common.name'
        }),
        useTextFilter<UserResponseDto>({
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
