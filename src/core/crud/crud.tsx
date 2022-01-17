import React, { createContext, useContext, useState } from 'react'
import { Button } from 'antd'
import { PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery, UseQueryResult } from 'react-query'
import { Modal, ButtonModal } from '../utils/modal'
import { ID, Identifiable, PageRequest } from '../types'
import { usePageableTable, UsePageableTableResult } from '../table'
import { Spin } from '../utils/spin'
import { CrudProps } from './types'
import { CrudMessages } from '.'
import { checkAccess, useAuth } from '../auth'

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

export function Crud<
  PageItemDto extends Identifiable,
  ItemDto,
  CreateDto,
  UpdateDto = CreateDto & Identifiable,
  FetchPageParams extends PageRequest = PageRequest
>({
  name,
  entityService,
  renderTable,
  messages = defaultMessages,
  initialFetchParams = {},
  accessRoles = {},
  renderCreateForm = nullRender,
  renderUpdateForm = nullRender
}: CrudProps<PageItemDto, ItemDto, CreateDto, UpdateDto, FetchPageParams>) {
  let { user } = useAuth()
  let table = usePageableTable({
    name: name,
    initialQueryParams: initialFetchParams,
    queryFn: entityService.fetchPage
  })

  let [activeRecordId, setActiveRecordId] = useState<ID>()
  let activeRecordQuery = useQuery({
    enabled: activeRecordId !== undefined,
    queryKey: [name, 'active-record', activeRecordId],
    queryFn: () => entityService.fetchById(activeRecordId as ID)
  })

  let enableCreate =
    renderCreateForm !== nullRender && checkAccess(user, accessRoles.createRole)

  let enableUpdate =
    renderUpdateForm !== nullRender && checkAccess(user, accessRoles.updateRole)

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
                      await entityService.create(values as CreateDto)
                      table.query.refetch()
                      modal.close()
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
                    await entityService.update(values)
                    activeRecordQuery.refetch()
                    table.query.refetch()
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
