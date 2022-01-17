export type ID = string | number

export type Identifiable = { id: ID }

export type PageRequest = { page?: number; size?: number }

export type SortBy<T extends string = string> = `${T},${'desc' | 'asc'}`

export type Page<T> = {
  content: T[]
  total: number
  page: number
  size: number
  pageCount: number
}

export type ErrorResponse = {
  response: { data: { message: string } }
}
