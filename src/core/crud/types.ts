import { ReactNode } from 'react'
import { UserRole } from '../auth'
import { CreateFormProps, FormProps } from '../form'
import { TranslationKeys } from '../localization'
import { PageableTableProps } from '../table'
import { ID, Identifiable, Page, PageRequest } from '../types'

export type CrudAccessRoles = {
  createRole?: UserRole
  updateRole?: UserRole
}

export type CrudMessages = {
  createTitle?: TranslationKeys
  updateTitle?: TranslationKeys
}

export type EntityService<
  PageItemDto extends Identifiable,
  ItemDto,
  CreateDto,
  UpdateDto = CreateDto & { id: string | number },
  FetchPageParams extends PageRequest = PageRequest
> = {
  fetchPage(params: FetchPageParams): Promise<Page<PageItemDto>>
  fetchById(id: ID): Promise<ItemDto>
  create(dto: CreateDto): Promise<any>
  update(dto: UpdateDto): Promise<any>
}

export type UpdateFormProps<T, K> = Omit<FormProps<T>, 'initialValues'> & {
  activeRecord: K
  initialValues?: T
}

export type CrudProps<
  PageItemDto extends Identifiable,
  ItemDto,
  CreateDto,
  UpdateDto = CreateDto & { id: string | number },
  FetchPageParams extends PageRequest = PageRequest
> = {
  name: string
  entityService: EntityService<
    PageItemDto,
    ItemDto,
    CreateDto,
    UpdateDto,
    FetchPageParams
  >
  messages?: CrudMessages
  accessRoles?: CrudAccessRoles
  initialFetchParams?: Partial<FetchPageParams>
  renderTable(
    props: PageableTableProps<PageItemDto, FetchPageParams>
  ): ReactNode
  renderCreateForm?(props: CreateFormProps<CreateDto>): ReactNode
  renderUpdateForm?(props: UpdateFormProps<UpdateDto, ItemDto>): ReactNode
}
