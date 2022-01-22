export type ID = string | number

export type Identifiable = { id: ID }

export type PageRequest = { page?: number; size?: number }

export type Page<T> = {
  content: T[]
  total: number
  page: number
  size: number
  pageCount: number
}

export type Record = Identifiable & {
  createdAt: string
  updatedAt: string
}

export type RecordSearch = PageRequest &
  Partial<Comparable<'createdAt' | 'updatedAt'>>

export type Sortable<T extends string = string> = {
  sortBy: `${T},${'desc' | 'asc'}`
}

export enum ComparisonOperator {
  gt = 'gt',
  lt = 'lt',
  gte = 'gte',
  lte = 'lte'
}

export type Comparable<T extends string = string> = {
  [key in `${T}_${ComparisonOperator}`]: string
}

export type ErrorResponse = {
  response: { data: { message: string } }
}
