import { http } from '@/core/http-client'
import { Page, ID } from '@/core/types'
import { UserRequest, UserResponse, UserMutationRequest } from './user-types'

const fetchPage = async (params: UserRequest): Promise<Page<UserResponse>> => {
  const { data } = await http.get<Page<UserResponse>>('/api/users', { params })
  return data
}

const fetchById = async (id: ID): Promise<UserResponse> => {
  const { data } = await http.get<UserResponse>(`/api/users/${id}`)
  return data
}

const create = async (data: UserMutationRequest) => {
  const res = await http.post('/api/users', data)
  return res.data
}

const update = async (data: UserMutationRequest) => {
  const res = await http.put('/api/users', data)
  return res.data
}

export const userService = {
  create,
  update,
  fetchPage,
  fetchById,
}
