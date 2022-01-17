import { PaginationProps, TablePaginationConfig } from 'antd'
import { FilterValue, SorterResult } from 'antd/lib/table/interface'

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

export let noop = () => {}

export let paginationAdapter = ({
  current,
  pageSize,
  onChange = noop,
  onShowSizeChange = noop,
  ...props
}: AdaptedPaginationProps): PaginationProps => {
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

export let tableOnChangeAdapter =
  (fn: (params: Record<string, number | string>) => void) =>
  <T>(
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => {
    const params = {
      page: (pagination.current ?? 1) - 1
    }

    // @ts-ignore
    if (sorter.order) {
      // @ts-ignore
      params.sortBy = [sorter.field, sorter.order.slice(0, -3)].join(',')
    }

    Object.keys(filters).forEach(key => {
      // @ts-ignore
      params[key] = filters[key]?.[0]
      // if (filters[key]) {
      //   // const value = filters[key]?.join(',')
      // }
    })

    fn(params)
  }
