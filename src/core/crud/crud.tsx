import React, { createContext, FC, useContext, useState } from 'react'
import { Button } from 'antd'
import { PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery, UseQueryResult } from 'react-query'
import { Modal, ButtonModal } from '../utils/modal'
import { ID, Identifiable, PageRequest } from '../types'
import { usePageableTable, PageabconstableProps } from '../table'
import { Spin } from '../utils/spin'
import { CrudProps } from './types'
import { CrudMessages } from '.'
import { checkAccess, useAuth } from '../auth'

export function Crud<
  PageItemDto extends Identifiable,
  ItemDto,
  CreateDto,
  UpdateDto = CreateDto & Identifiable,
  FetchPageParams extends PageRequest = PageRequest,
>(
  props: CrudProps<PageItemDto, ItemDto, CreateDto, UpdateDto, FetchPageParams>,
) {
  const crud = useCrud(props)
  return (
    <CrudTableContext.Provider value={crud.table}>
      <CrudActiveRecordContext.Provider value={crud.activeRecordQuery}>
        {props.layout === 'modal' ? (
          <CrudModalLayout {...(crud as any)} />
        ) : (
          <CrudSplitLayout {...(crud as any)} />
        )}
      </CrudActiveRecordContext.Provider>
    </CrudTableContext.Provider>
  )
}

const nullRender = () => null
const defaultMessages: CrudMessages = {
  createTitle: 'common.create',
  updateTitle: 'common.update',
}

export function useCrud<
  PageItemDto extends Identifiable,
  ItemDto,
  CreateDto,
  UpdateDto = CreateDto & Identifiable,
  FetchPageParams extends PageRequest = PageRequest,
>({
  name,
  entityService,
  renderTable,
  messages = defaultMessages,
  initialFetchParams,
  accessRoles = {},
  renderCreateForm = nullRender,
  renderUpdateForm = nullRender,
  renderHeader = nullRender,
}: CrudProps<PageItemDto, ItemDto, CreateDto, UpdateDto, FetchPageParams>) {
  const { user } = useAuth()
  const table = usePageableTable({
    name: name,
    initialQueryParams: initialFetchParams,
    queryFn: entityService.fetchPage,
  })

  const [activeRecordId, setActiveRecordId] = useState<ID>()
  const activeRecordQuery = useQuery({
    keepPreviousData: true,
    enabled: activeRecordId !== undefined,
    queryKey: [name, 'active-record', activeRecordId],
    queryFn: () => entityService.fetchById(activeRecordId as ID),
  })

  const enableCreate =
    renderCreateForm !== nullRender && checkAccess(user, accessRoles.createRole)

  const enableUpdate =
    renderUpdateForm !== nullRender && checkAccess(user, accessRoles.updateRole)

  return {
    activeRecordId,
    setActiveRecordId,
    entityService,
    messages,
    table,
    activeRecordQuery,
    enableCreate,
    enableUpdate,
    renderCreateForm,
    renderUpdateForm,
    renderHeader,
    renderTable,
  }
}

const CrudTableContext = createContext<unknown>(null)
export function useCrudTable<T, K>() {
  return useContext(CrudTableContext) as PageabconstableProps<T, K>
}

const CrudActiveRecordContext = createContext<unknown>(null)
export function useCrudActiveRecord<T>() {
  return useContext(CrudActiveRecordContext) as UseQueryResult<T>
}

export function CrudSplitLayout(props: ReturnType<typeof useCrud>) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', flex: 1 }}>
          {props.enableCreate ? (
            <ButtonModal
              title={props.messages.createTitle ?? defaultMessages.createTitle}
              buttonProps={{
                type: 'primary',
                icon: <PlusCircleOutlined />,
              }}
              modalProps={{ width: 900, destroyOnClose: true }}
            >
              {(modal) =>
                props.renderCreateForm({
                  successMessage: 'common.successfullyExecuted',
                  async onSubmit(values) {
                    await props.entityService.create(values)
                    props.table.query.refetch()
                    modal.close()
                  },
                })
              }
            </ButtonModal>
          ) : null}

          {props.renderHeader !== nullRender ? (
            <div>{props.renderHeader(props.table)}</div>
          ) : null}
        </div>

        <Button
          type="ghost"
          shape="circle"
          icon={<ReloadOutlined />}
          loading={props.table.query.isLoading}
          onClick={() => props.table.query.refetch()}
        />
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 64, marginRight: 8 }}>
          {props.renderTable({
            ...props.table,
            ...(props.enableUpdate
              ? {
                  rowClassName: 'clickable',
                  onRow: (record) => ({
                    onClick() {
                      props.setActiveRecordId(record.id)
                    },
                  }),
                }
              : {}),
          })}
        </div>

        {props.enableUpdate && props.activeRecordId && (
          <>
            <div style={{ flex: 1 }} />
            <div
              style={{
                flex: 35,
                padding: 16,
                border: '1px solid #F0F2F5',
                borderRadius: 4,
              }}
            >
              {props.activeRecordQuery.data ? (
                props.renderUpdateForm({
                  successMessage: 'common.successfullyExecuted',
                  activeRecord: props.activeRecordQuery.data,
                  async onSubmit(values) {
                    await props.entityService.update(values)
                    props.activeRecordQuery.refetch()
                    props.table.query.refetch()
                  },
                })
              ) : (
                <Spin delay={200} spinning />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function CrudModalLayout(props: ReturnType<typeof useCrud>) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', flex: 1 }}>
          {props.enableCreate ? (
            <ButtonModal
              title={props.messages.createTitle ?? defaultMessages.createTitle}
              buttonProps={{
                type: 'primary',
                icon: <PlusCircleOutlined />,
              }}
              modalProps={{ width: 900, destroyOnClose: true }}
            >
              {(modal) =>
                props.renderCreateForm({
                  successMessage: 'common.successfullyExecuted',
                  async onSubmit(values) {
                    await props.entityService.create(values)
                    props.table.query.refetch()
                    modal.close()
                  },
                })
              }
            </ButtonModal>
          ) : null}

          {props.renderHeader !== nullRender ? (
            <div>{props.renderHeader(props.table)}</div>
          ) : null}
        </div>

        <Button
          type="ghost"
          shape="circle"
          icon={<ReloadOutlined />}
          loading={props.table.query.isLoading}
          onClick={() => props.table.query.refetch()}
        />
      </div>

      <div className="py-8">
        {props.renderTable({
          ...props.table,
          ...(props.enableUpdate
            ? {
                rowClassName: 'clickable',
                onRow: (record) => ({
                  onClick() {
                    props.setActiveRecordId(record.id)
                  },
                }),
              }
            : {}),
        })}
      </div>

      {props.enableUpdate && (
        <Modal
          width={900}
          on={props.activeRecordId !== undefined}
          close={() => props.setActiveRecordId(undefined)}
        >
          {props.activeRecordQuery.data ? (
            props.renderUpdateForm({
              successMessage: 'common.successfullyExecuted',
              activeRecord: props.activeRecordQuery.data,
              async onSubmit(values) {
                await props.entityService.update(values)
                props.activeRecordQuery.refetch()
                props.table.query.refetch()
              },
            })
          ) : (
            <Spin spinning />
          )}
        </Modal>
      )}
    </div>
  )
}
