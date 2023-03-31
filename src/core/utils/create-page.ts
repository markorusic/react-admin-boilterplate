import { PageRequest } from '../types'

export const createPage = <T>(data: T[], params?: PageRequest) => {
  const page = parseInt((params?.page ?? 0).toString())
  const size = parseInt((params?.size ?? 10).toString())

  return {
    content: data.slice(page * size, (page + 1) * size),
    page,
    size,
    total: data.length,
    pageCount: Math.max(0, Math.ceil(data.length / size) - 1),
  }
}
