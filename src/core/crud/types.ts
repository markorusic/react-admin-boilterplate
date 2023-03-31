import { ReactNode } from 'react'
import { UserRole } from '../auth'
import { CreateFormProps, FormProps } from '../form'
import { TranslationKeys } from '../localization'
import { PageabconstableProps } from '../table'
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
  UpdateDto = CreateDto & Identifiable,
  FetchPageParams extends PageRequest = PageRequest,
> = {
  fetchPage(params: FetchPageParams): Promise<Page<PageItemDto>>
  fetchById(id: ID): Promise<ItemDto>
  create(dto: CreateDto): Promise<unknown>
  update(dto: UpdateDto): Promise<unknown>
}

export type UpdateFormProps<T, K> = Omit<FormProps<T>, 'initialValues'> & {
  activeRecord: K
  initialValues?: T
}

export type CrudProps<
  PageItemDto extends Identifiable = Identifiable & unknown,
  ItemDto = unknown,
  CreateDto = unknown,
  UpdateDto = CreateDto & Identifiable,
  FetchPageParams extends PageRequest = PageRequest,
> = {
  name: string
  entityService: EntityService<
    PageItemDto,
    ItemDto,
    CreateDto,
    UpdateDto,
    FetchPageParams
  >
  layout?: 'modal' | 'split'
  messages?: CrudMessages
  accessRoles?: CrudAccessRoles
  initialFetchParams?: FetchPageParams
  renderTable(
    props: PageabconstableProps<PageItemDto, FetchPageParams>,
  ): ReactNode
  renderCreateForm?(props: CreateFormProps<CreateDto>): ReactNode
  renderUpdateForm?(props: UpdateFormProps<UpdateDto, ItemDto>): ReactNode
  renderHeader?(
    props: PageabconstableProps<PageItemDto, FetchPageParams>,
  ): ReactNode
}
