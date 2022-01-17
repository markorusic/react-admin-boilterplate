import React, { createContext, useContext, useState } from 'react'
import { Button, notification } from 'antd'
import { PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery, UseQueryResult } from 'react-query'
import { Modal, ButtonModal } from '../utils/modal'
import { ID, Identifiable, PageRequest } from '../types'
import { usePageableTable, UsePageableTableResult } from '../table'
import { useLang } from '../localization'
import { Spin } from '../utils/spin'
import { CrudProps } from './types'
import { CrudMessages } from '.'

let CrudTableContext = createContext<UsePageableTableResult<any, any> | null>(
  null
)
export let useCrudTable = <T, K>() => {
  return useContext(CrudTableContext) as UsePageableTableResult<T, K>
}

let CrudActiveRecordContext = createContext<UseQueryResult<any> | null>(null)
export let useCrudActiveRecord = <T,>() => {
  return useContext(CrudActiveRecordContext) as UseQueryResult<T>
}

let nullRender = () => null
let defaultMessages: CrudMessages = {
  createTitle: 'common.create',
  updateTitle: 'common.update'
}

function Crud<
  PageItemDto extends Identifiable,
  ItemDto,
  CreateDto,
  UpdateDto = CreateDto & { id: string | number },
  FetchPageParams extends PageRequest = PageRequest
>({
  name,
  entityService,
  renderTable,
  messages = defaultMessages,
  initialFetchParams = {},
  renderCreateForm = nullRender,
  renderUpdateForm = nullRender
}: CrudProps<PageItemDto, ItemDto, CreateDto, UpdateDto, FetchPageParams>) {
  let { t } = useLang()
  let table = usePageableTable({
    name: name,
    initialQueryParams: initialFetchParams,
    queryFn: entityService.fetchPage
  })

  let enableUpdate = renderUpdateForm !== nullRender
  let enableCreate = renderCreateForm !== nullRender

  let [activeRecordId, setActiveRecordId] = useState<ID>()
  let activeRecordQuery = useQuery({
    enabled: activeRecordId !== undefined,
    queryKey: [name, 'active-record', activeRecordId],
    queryFn: () => entityService.fetchById(activeRecordId as ID)
  })

  return (
    <CrudTableContext.Provider value={table}>
      <CrudActiveRecordContext.Provider value={activeRecordQuery}>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8
            }}
          >
            {enableCreate ? (
              <ButtonModal
                title={messages.createTitle ?? defaultMessages.createTitle}
                buttonProps={{ type: 'primary', icon: <PlusCircleOutlined /> }}
                modalProps={{ width: 900, destroyOnClose: true }}
              >
                {modal =>
                  renderCreateForm({
                    successMessage: 'common.successfullyExecuted',
                    async onSubmit(values) {
                      try {
                        await entityService.create(values as CreateDto)
                        table.query.refetch()
                        modal.close()
                      } catch (err) {
                        notification.error({
                          message: t('error.unknown')
                        })
                      }
                    }
                  })
                }
              </ButtonModal>
            ) : (
              <div />
            )}

            <Button
              type="ghost"
              shape="circle"
              icon={<ReloadOutlined />}
              loading={table.query.isLoading}
              onClick={() => table.query.refetch()}
            />
          </div>

          <div className="py-8">
            {renderTable({
              ...table,
              ...(enableUpdate
                ? {
                    rowClassName: 'clickable',
                    onRow: record => ({
                      onClick() {
                        setActiveRecordId(record.id)
                      }
                    })
                  }
                : {})
            })}
          </div>

          {enableUpdate && (
            <Modal
              width={900}
              on={activeRecordId !== undefined}
              close={() => setActiveRecordId(undefined)}
            >
              {activeRecordQuery.data ? (
                renderUpdateForm({
                  successMessage: 'common.successfullyExecuted',
                  activeRecord: activeRecordQuery.data,
                  async onSubmit(values) {
                    try {
                      await entityService.update(values)
                      activeRecordQuery.refetch()
                      table.query.refetch()
                    } catch (err) {
                      notification.error({ message: t('error.unknown') })
                    }
                  }
                })
              ) : (
                <Spin spinning />
              )}
            </Modal>
          )}
        </div>
      </CrudActiveRecordContext.Provider>
    </CrudTableContext.Provider>
  )
}

export default Crud
