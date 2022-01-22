import { useEffect, useRef } from 'react'
import { Button, Input } from 'antd'
import { ClearOutlined, SearchOutlined } from '@ant-design/icons'
import { FilterDropdownProps } from 'antd/lib/table/interface'
import { useLang } from '../localization'
import { TableColumn } from './table'

function TextTableFilter(props: FilterDropdownProps) {
  let { t } = useLang()
  let searchInputRef = useRef<Input>(null)

  useEffect(() => {
    if (props.visible) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    }
  }, [props.visible])

  return (
    <div style={{ padding: 8 }}>
      <Input
        ref={searchInputRef}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
        placeholder={t('common.searchTerm')}
        value={props.selectedKeys[0]}
        onPressEnter={() => props.confirm()}
        onChange={event => {
          props.setSelectedKeys(event.target.value ? [event.target.value] : [])
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          size="small"
          style={{ width: 90 }}
          icon={<ClearOutlined />}
          onClick={() => {
            props.clearFilters?.()
            props.confirm()
          }}
        >
          {t('common.clear')}
        </Button>
        <Button
          type="primary"
          size="small"
          style={{ width: 90 }}
          icon={<SearchOutlined />}
          onClick={() => props.confirm()}
        >
          {t('common.search')}
        </Button>
      </div>
    </div>
  )
}

export function textFilterColumn<T = any>(
  column: TableColumn<T>
): TableColumn<T> {
  return {
    ...column,
    filterDropdown: props => <TextTableFilter {...props} />,
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    )
  }
}
