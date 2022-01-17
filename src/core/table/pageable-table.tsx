import React, { useState } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { notification, TableProps as BaseTableProps } from 'antd'
import { Page, PageRequest } from '../types'
import { useLang } from '../localization'
import { tableOnChangeAdapter, paginationAdapter } from './table-adapters'
import { TableColumn, TableProps } from './table'

export type UsePageableTableOptions<PageItem, FetchParams> = {
  name: string
  queryFn(params: FetchParams): Promise<Page<PageItem>>
  initialQueryParams?: FetchParams
  enabled?: boolean
}

export type UsePageableTableResult<PageItem, FetchParams> =
  TableProps<PageItem> & {
    query: UseQueryResult<Page<PageItem>>
    queryParams: FetchParams
    setQueryParams: React.Dispatch<React.SetStateAction<FetchParams>>
  }

export let usePageableTable = <PageItem, FetchParams>({
  enabled = true,
  ...props
}: UsePageableTableOptions<PageItem, FetchParams>): UsePageableTableResult<
  PageItem,
  FetchParams
> => {
  let { t } = useLang()
  let [queryParams, setQueryParams] = useState<FetchParams & PageRequest>({
    // @ts-ignore
    page: 0,
    size: 10,
    ...props.initialQueryParams
  })

  let pageDataQuery = useQuery({
    queryKey: [props.name, '_table', Object.values(queryParams)],
    queryFn: () => props.queryFn(queryParams),
    keepPreviousData: true,
    enabled,
    onError: () => {
      notification.error({ message: t('error.unknown') })
    }
  })

  return {
    queryParams,
    setQueryParams,
    query: pageDataQuery,
    dataSource: pageDataQuery.data?.content ?? [],
    onChange: tableOnChangeAdapter(updatedParams => {
      setQueryParams(currentParams => ({
        ...currentParams,
        ...updatedParams
      }))
    }),
    pagination: {
      ...paginationAdapter({
        pageSize: queryParams.size,
        current: queryParams.page,
        total: pageDataQuery.data?.total
      })
    }
  }
}

export type PageableTableProps<T, K> = TableProps<T> & {
  getColumns?: (table: UsePageableTableResult<T, K>) => TableColumn<T>[]
} & Pick<UsePageableTableOptions<T, K>, 'initialQueryParams'>
