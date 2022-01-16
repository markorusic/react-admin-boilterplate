import React, { useRef } from 'react'
import { ClearOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, TableProps as BaseTableProps } from 'antd'
import { useLang } from '../localization'
import { TableColumn } from './table'

export let useTextFilter = <T,>(column: TableColumn<T>): TableColumn<T> => {
  let { t } = useLang()
  let searchInputRef = useRef<Input>(null)
  return {
    ...column,
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInputRef}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          placeholder={'Search term'}
          value={selectedKeys[0]}
          onPressEnter={() => confirm()}
          onChange={event =>
            setSelectedKeys(event.target.value ? [event.target.value] : [])
          }
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            size="small"
            style={{ width: 90 }}
            icon={<ClearOutlined />}
            onClick={() => clearFilters?.()}
          >
            {t('common.clear')}
          </Button>
          <Button
            type="primary"
            size="small"
            style={{ width: 90 }}
            icon={<SearchOutlined />}
            onClick={() => confirm()}
          >
            {t('common.search')}
          </Button>
        </div>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInputRef.current?.select())
      }
    }
  }
}
