import React from 'react'
import { UserRole } from '../../core/auth'
import {
  PageableTableProps,
  Table,
  usePageableTable,
  useTextFilter
} from '../../core/table'
import { Page } from '../../core/types'
import { formatDate } from '../../core/utils/date'
import { UserResponse, UserRequest, UserStatus } from './types'

export type UserTableProps = PageableTableProps<UserResponse, UserRequest>

let queryFn = async (params: UserRequest): Promise<Page<UserResponse>> => {
  //   let { data } = axios.get<Page<UserResponse>>('/api/users', { params })
  //   return data
  let total = 100
  let page = params.page as number
  let size = params.size as number
  let content: UserResponse[] = []

  for (let id = 1; id < total + 1; id++) {
    content.push({
      id,
      name: `User ${id}`,
      email: `user${id}@gmail.com`,
      role: Math.random() > 0.5 ? UserRole.admin : UserRole.superAdmin,
      status: Math.random() > 0.8 ? UserStatus.inactive : UserStatus.active,
      createdAt: new Date().toString()
    })
  }

  return {
    content: content.slice(page * size, (page + 1) * size),
    page,
    size,
    total,
    pageCount: Math.max(0, Math.ceil(total / size) - 1)
  }
}

export let UserTable = ({ initialQueryParams, ...props }: UserTableProps) => {
  const { query, ...tableProps } = usePageableTable({
    name: 'user-table',
    initialQueryParams,
    queryFn
  })

  return (
    <Table
      {...props}
      {...tableProps}
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
