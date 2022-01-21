import React, { useState } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { notification, TableProps as BaseTableProps } from 'antd'
import { Page, PageRequest } from '../types'
import { useLang } from '../localization'
import {
  tableOnChangeAdapter,
  paginationAdapter,
  pageableTableColumnsAdapter
} from './table-adapters'
import { Table, TableProps } from './table'

export type UsePageableTableOptions<
  PageItem,
  FetchParams extends PageRequest
> = {
  name: string
  queryFn(params: FetchParams): Promise<Page<PageItem>>
  initialQueryParams?: FetchParams
  enabled?: boolean
}

export type PageableTableProps<
  PageItem,
  FetchParams extends PageRequest
> = TableProps<PageItem> & {
  query: UseQueryResult<Page<PageItem>>
  queryParams: FetchParams
  setQueryParams: React.Dispatch<React.SetStateAction<FetchParams>>
}

export let usePageableTable = <PageItem, FetchParams extends PageRequest>({
  enabled = true,
  ...props
}: UsePageableTableOptions<PageItem, FetchParams>): PageableTableProps<
  PageItem,
  FetchParams
> => {
  let { t } = useLang()
  // @ts-ignore
  let [queryParams, setQueryParams] = useState<FetchParams>({
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

export function PageableTable<T, K extends PageRequest>(
  props: PageableTableProps<T, K>
) {
  return (
    <Table
      {...props}
      columns={pageableTableColumnsAdapter(props.queryParams, props.columns)}
    />
  )
}
