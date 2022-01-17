import {
  PageableTableProps,
  Table,
  TableColumn,
  useTextFilter
} from '../../core/table'
import { SortBy } from '../../core/types'
import { formatDate } from '../../core/utils/date'
import { UserRequest, UserResponse } from './types'

export type UserTableProps = PageableTableProps<UserResponse, UserRequest>

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
          title: 'common.email',
          sorter: true
        }),
        sorterColumn<UserResponse, UserRequest>(props, {
          name: 'createdAt',
          title: 'common.createdAt',
          render: formatDate
        })
      ]}
    />
  )
}

let sorterColumn = <T, K>(
  props: PageableTableProps<T, K>,
  column: TableColumn<T>
): TableColumn<T> => {
  // @ts-ignore
  let sortBy: SortBy | undefined = props.initialQueryParams?.sortBy

  console.log(props.initialQueryParams)
  if (!sortBy) {
    return { ...column, sorter: true }
  }

  let [columnName, order] = sortBy.split(',')

  if (columnName !== column.name) {
    return { ...column, sorter: true }
  }

  return {
    ...column,
    sorter: true,
    defaultSortOrder: order === 'desc' ? 'descend' : 'ascend'
  }
}
