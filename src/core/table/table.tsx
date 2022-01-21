import { Table as BaseTable, TableProps as BaseTableProps } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { Spin } from '../utils/spin'
import { TranslationKeys, useLang } from '../localization'

export type TableColumn<T> = Omit<
  ColumnType<T>,
  'dataIndex' | 'key' | 'title'
> & {
  name: string
  title?: TranslationKeys
  unsafe_title?: string
}

export type TableProps<T> = Omit<BaseTableProps<T>, 'columns'> & {
  columns?: TableColumn<T>[]
}

export function Table<T>({ columns = [], loading, ...props }: TableProps<T>) {
  let { t } = useLang()
  return (
    <BaseTable
      // @ts-ignore
      rowKey="id"
      {...props}
      // @ts-ignore
      columns={columns.map(({ name, ...column }) => ({
        ...column,
        title: column.title ? t(column.title) : column.unsafe_title,
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
