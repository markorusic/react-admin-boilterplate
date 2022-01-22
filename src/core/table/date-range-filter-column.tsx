import dayjs, { Dayjs } from 'dayjs'
import { SearchOutlined } from '@ant-design/icons'
import { RangePickerProps } from 'antd/lib/date-picker/generatePicker'
import { TableColumn } from './table'
import { DatePicker } from '../form/date-picker'
import { useTableContext } from './pageable-table'

type Props = RangePickerProps<dayjs.Dayjs> & {
  name: string
}

function DateRangeTableFilter({ name, ...props }: Props) {
  let table = useTableContext()

  let minFieldName = `${name}_gte`
  let maxFieldName = `${name}_lte`
  let min = table.queryParams[minFieldName] as string
  let max = table.queryParams[maxFieldName] as string

  function setValues(values: (Dayjs | null)[]) {
    let minValue = values[0]?.format()
    let maxValue = values[1]?.format()

    table.setQueryParams((params: any) => ({
      ...params,
      [minFieldName]: minValue,
      [maxFieldName]: maxValue
    }))
  }

  return (
    <div style={{ padding: 8 }}>
      <DatePicker.RangePicker
        {...props}
        value={min && max ? [dayjs(min), dayjs(max)] : undefined}
        onChange={values => {
          values ? setValues(values) : setValues([])
        }}
      />
    </div>
  )
}

export function dateRangeFilterColumn<T = any>(
  column: TableColumn<T>,
  options?: RangePickerProps<dayjs.Dayjs>
): TableColumn<T> {
  return {
    ...column,
    filterDropdown: () => (
      <DateRangeTableFilter {...options} name={column.name} />
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    )
  }
}
