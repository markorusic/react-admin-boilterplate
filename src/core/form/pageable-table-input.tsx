import React, { useRef } from 'react'
import { useFormikContext } from 'formik'
import {
  TableProps,
  PageabconstableProps,
  usePageableTable,
  UsePageableTableOptions,
  Pageabconstable,
} from '../table'
import { ID } from '../types'
import { BaseInputProps, FormInputContainer } from '.'

function mapIds(record: any): ID {
  return record['id']
}

export function usePageableTableInput<T, K>(
  options: UsePageableTableOptions<T, K>,
): PageabconstableProps<T, K> {
  const uniqueName = useRef(
    `pageable_table_input_${options.name}_${(Math.random() + 1)
      .toString(36)
      .substring(2)}`,
  )
  const table = usePageableTable({ ...options, name: uniqueName.current })
  const form = useFormikContext<any>()

  const currentValue: ID[] = form.values[options.name] ?? []

  return {
    ...table,
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: currentValue,
      onChange: (_, currentPageItems) => {
        const allItems = table.dataSource ? table.dataSource?.map(mapIds) : []
        const currentPageValue = currentPageItems.map(mapIds)
        const otherPagesValue = currentValue.filter(
          (i) => !allItems.includes(i),
        )
        const value = [...otherPagesValue, ...currentPageValue]
        form.setFieldValue(options.name, value)
      },
    },
  }
}

export type PageableTableInputProps<T, K> = BaseInputProps &
  UsePageableTableOptions<T, K> &
  TableProps<T>

export function PageableTableInput<T, K>(props: PageableTableInputProps<T, K>) {
  const tableField = usePageableTableInput(props)
  return (
    <FormInputContainer {...props}>
      <Pageabconstable
        {...props}
        {...tableField}
        rowSelection={{
          ...tableField.rowSelection,
          ...props.rowSelection,
        }}
      />
    </FormInputContainer>
  )
}
