import { PaginationProps, TablePaginationConfig } from 'antd'
import { FilterValue, SorterResult } from 'antd/lib/table/interface'
import { TableColumn } from './table'

type OmitedPaginationProps =
  | 'onChange'
  | 'current'
  | 'onShowSizeChange'
  | 'pageSize'

export interface AdaptedPaginationProps
  extends Omit<PaginationProps, OmitedPaginationProps> {
  current?: number | string | undefined
  pageSize?: number | string | undefined
  onChange?(page: string): void
  onShowSizeChange?(page: string, size: string): void
}

export function noop() {}

export function paginationAdapter({
  current,
  pageSize,
  onChange = noop,
  onShowSizeChange = noop,
  ...props
}: AdaptedPaginationProps): PaginationProps {
  return {
    showSizeChanger: false,
    ...props,
    pageSize: pageSize ? parseInt(pageSize.toString()) : 10,
    current: current ? parseInt(current.toString()) + 1 : 1,
    onChange: page => onChange((page - 1).toString()),
    onShowSizeChange: (page, size) =>
      onShowSizeChange((page - 1).toString(), size.toString())
  }
}

type Params = Record<string, number | string | boolean | undefined | null>
type OnChangeAdapterCallback = (params: Params) => void

export function tableOnChangeAdapter(fn: OnChangeAdapterCallback) {
  return function <T>(
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) {
    let params: Params = {
      page: (pagination.current ?? 1) - 1
    }

    let { order, field } = Array.isArray(sorter) ? sorter[0] : sorter
    if (order) {
      params.sortBy = [field, order.slice(0, -3)].join(',')
    } else {
      params.sortBy = undefined
    }

    Object.keys(filters).forEach(key => {
      let value = filters[key]
      params[key] = value && value.length > 0 ? value.join(',') : undefined
    })

    fn(params)
  }
}

export function pageableTableColumnsAdapter<T>(
  params: Params,
  columns: TableColumn<T>[] = []
): TableColumn<T>[] {
  return columns.map(column => {
    let newColumn = { ...column }

    let { sortBy } = params
    let filterValue = params[newColumn.name]

    if (filterValue && filterValue.toString().length > 0) {
      newColumn.filteredValue = filterValue.toString().split(',')
    } else {
      newColumn.filteredValue = []
    }

    if (newColumn.sorter && sortBy) {
      let [columnName, order] = sortBy.toString().split(',')
      if (columnName === newColumn.name) {
        newColumn.sortOrder = order === 'desc' ? 'descend' : 'ascend'
      }
    }

    return newColumn
  })
}
