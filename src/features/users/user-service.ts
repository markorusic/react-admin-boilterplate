import { http } from '@/core/http-client'
import { Page, ID } from '@/core/types'
import { UserRequest, UserResponse, UserMutationRequest } from './user-types'

let fetchPage = async (params: UserRequest): Promise<Page<UserResponse>> => {
  let { data } = await http.get<Page<UserResponse>>('/api/users', { params })
  return data
}

let fetchById = async (id: ID): Promise<UserResponse> => {
  let { data } = await http.get<UserResponse>(`/api/users/${id}`)
  return data
}

let create = async (data: UserMutationRequest) => {
  let res = await http.post('/api/users', data)
  return res.data
}

let update = async (data: UserMutationRequest) => {
  let res = await http.put('/api/users', data)
  return res.data
}

export let userService = {
  create,
  update,
  fetchPage,
  fetchById
}
