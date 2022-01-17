import axios from 'axios'
import { Page, ID } from '../../core/types'
import { UserRequest, UserResponse, UserMutationRequest } from './types'

let fetchPage = async (params: UserRequest): Promise<Page<UserResponse>> => {
  let { data } = await axios.get<Page<UserResponse>>('/api/users', { params })
  return data
}

let fetchById = async (id: ID): Promise<UserResponse> => {
  let { data } = await axios.get<UserResponse>(`/api/users/${id}`)
  return data
}

let create = async (data: UserMutationRequest) => {
  let res = await axios.post('/api/users', data)
  return res.data
}

let update = async (data: UserMutationRequest) => {
  let res = await axios.put('/api/users', data)
  return res.data
}

export let userService = {
  create,
  update,
  fetchPage,
  fetchById
}
