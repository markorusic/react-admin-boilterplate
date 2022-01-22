import React, { useRef } from 'react'
import { useFormikContext } from 'formik'
import {
  TableProps,
  PageableTableProps,
  usePageableTable,
  UsePageableTableOptions,
  PageableTable
} from '../table'
import { ID } from '../types'
import { BaseInputProps, FormInputContainer } from '.'

function mapIds(record: any): ID {
  return record['id']
}

export function usePageableTableInput<T, K>(
  options: UsePageableTableOptions<T, K>
): PageableTableProps<T, K> {
  let uniqueName = useRef(
    `pageable_table_input_${options.name}_${(Math.random() + 1)
      .toString(36)
      .substring(2)}`
  )
  let table = usePageableTable({ ...options, name: uniqueName.current })
  let form = useFormikContext<any>()

  let currentValue: ID[] = form.values[options.name] ?? []

  return {
    ...table,
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: currentValue,
      onChange: (_, currentPageItems) => {
        let allItems = table.dataSource ? table.dataSource?.map(mapIds) : []
        let currentPageValue = currentPageItems.map(mapIds)
        let otherPagesValue = currentValue.filter(i => !allItems.includes(i))
        let value = [...otherPagesValue, ...currentPageValue]
        form.setFieldValue(options.name, value)
      }
    }
  }
}

export type PageableTableInputProps<T, K> = BaseInputProps &
  UsePageableTableOptions<T, K> &
  TableProps<T>

export function PageableTableInput<T, K>(props: PageableTableInputProps<T, K>) {
  let tableField = usePageableTableInput(props)
  return (
    <FormInputContainer {...props}>
      <PageableTable
        {...props}
        {...tableField}
        rowSelection={{
          ...tableField.rowSelection,
          ...props.rowSelection
        }}
      />
    </FormInputContainer>
  )
}
