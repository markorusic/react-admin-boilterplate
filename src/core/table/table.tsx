import React from 'react'
import { Table as BaseTable, TableProps as BaseTableProps } from 'antd'

import { ColumnType } from 'antd/lib/table'
import { Spin } from '../utils/spin'

export type TableColumn<T> = Omit<ColumnType<T>, 'dataIndex' | 'key'> & {
  name: string
}

export interface TableProps<T> extends Omit<BaseTableProps<T>, 'columns'> {
  columns?: TableColumn<T>[]
}

export let Table = <T,>({ columns = [], loading, ...props }: TableProps<T>) => {
  return (
    <BaseTable
      // @ts-ignore
      rowKey="id"
      {...props}
      // @ts-ignore
      columns={columns.map(({ name, ...column }) => ({
        ...column,
        dataIndex: name,
        key: name
      }))}
      loading={{
        spinning: !!loading,
        indicator: <Spin />
      }}
    />
  )
}
