import React, { createContext, useContext, useState } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { notification, TableProps as BaseTableProps } from 'antd'
import { Page, PageRequest } from '../types'
import { useLang } from '../localization'
import {
  tableOnChangeAdapter,
  paginationAdapter,
  pageabconstableColumnsAdapter,
} from './table-adapters'
import { Table, TableProps } from './table'

export type UsePageableTableOptions<
  PageItem,
  FetchParams extends PageRequest,
> = {
  name: string
  queryFn(params: FetchParams): Promise<Page<PageItem>>
  initialQueryParams?: FetchParams
  enabled?: boolean
}

export type PageabconstableProps<
  PageItem,
  FetchParams extends PageRequest,
> = TableProps<PageItem> & {
  query: UseQueryResult<Page<PageItem>>
  queryParams: FetchParams
  setQueryParams: React.Dispatch<React.SetStateAction<FetchParams>>
}

export const usePageableTable = <PageItem, FetchParams extends PageRequest>({
  enabled = true,
  ...props
}: UsePageableTableOptions<PageItem, FetchParams>): PageabconstableProps<
  PageItem,
  FetchParams
> => {
  const { t } = useLang()
  // @ts-ignore
  const [queryParams, setQueryParams] = useState<FetchParams>({
    page: 0,
    size: 10,
    ...props.initialQueryParams,
  })

  const pageDataQuery = useQuery({
    queryKey: [props.name, '_table', Object.values(queryParams)],
    queryFn: () => props.queryFn(queryParams),
    keepPreviousData: true,
    enabled,
    onError: () => {
      notification.error({ message: t('error.unknown') })
    },
  })

  return {
    queryParams,
    setQueryParams,
    query: pageDataQuery,
    dataSource: pageDataQuery.data?.content ?? [],
    onChange: tableOnChangeAdapter((updatedParams) => {
      setQueryParams((currentParams) => ({
        ...currentParams,
        ...updatedParams,
      }))
    }),
    pagination: {
      ...paginationAdapter({
        pageSize: queryParams.size,
        current: queryParams.page,
        total: pageDataQuery.data?.total,
      }),
    },
  }
}

const PageabconstableContext = createContext<unknown>(null)
export function useTableContext<T = any, K = any>() {
  return useContext(PageabconstableContext) as PageabconstableProps<T, K>
}

export function Pageabconstable<T, K extends PageRequest>(
  props: PageabconstableProps<T, K>,
) {
  return (
    <PageabconstableContext.Provider value={props}>
      <Table
        {...props}
        columns={pageabconstableColumnsAdapter(
          props.queryParams,
          props.columns,
        )}
      />
    </PageabconstableContext.Provider>
  )
}
