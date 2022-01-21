import {
  useTextFilterColumn,
  PageableTableProps,
  PageableTable
} from '../../core/table'
import { formatDate } from '../../core/utils/date'
import { UserRequest, UserResponse } from './types'

export type UserTableProps = PageableTableProps<UserResponse, UserRequest>

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
          name: 'createdAt',
          title: 'common.createdAt',
          sorter: true,
          render: formatDate
        }
      ]}
    />
  )
}
