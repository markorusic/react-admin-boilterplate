import React from 'react'
import { UserRole } from '../../core/auth'
import Crud from '../../core/crud/crud'
import { ID, Page } from '../../core/types'
import {
  UserMutationRequest,
  UserRequest,
  UserResponse,
  UserStatus
} from './types'
import { UserCreateForm } from './user-create-form'
import { UserTable } from './user-table'
import { UserUpdateForm } from './user-update-form'

let userServiceFactory = () => {
  let totalUserCount = 100
  let userCollection: UserResponse[] = []

  for (let id = 1; id < totalUserCount + 1; id++) {
    userCollection.push({
      id,
      name: `User ${id}`,
      email: `user${id}@gmail.com`,
      role: Math.random() > 0.5 ? UserRole.admin : UserRole.superAdmin,
      status: Math.random() > 0.8 ? UserStatus.inactive : UserStatus.active,
      createdAt: new Date().toString()
    })
  }

  let fetchPage = async (params: UserRequest): Promise<Page<UserResponse>> => {
    //   let { data } = axios.get<Page<UserResponse>>('/api/users', { params })
    //   return data
    let page = params.page as number
    let size = params.size as number
    return {
      content: userCollection.slice(page * size, (page + 1) * size),
      page,
      size,
      total: totalUserCount,
      pageCount: Math.max(0, Math.ceil(totalUserCount / size) - 1)
    }
  }

  let fetchById = async (id: ID): Promise<UserResponse> => {
    //   let { data } = axios.get<UserResponse>(`/api/users/${id}`)
    //   return data
    let data: UserResponse = {
      id: 1,
      name: 'user',
      email: 'user@gmail.com',
      role: UserRole.admin,
      status: UserStatus.active,
      createdAt: new Date().toString()
    }
    return data
  }

  let create = async (data: UserMutationRequest) => {
    //   let { data } = axios.post('/api/users', data)
    //   return data
    return null
  }

  let update = async (data: UserMutationRequest) => {
    //   let { data } = axios.put('/api/users', data)
    //   return data
    return null
  }
  return {
    create,
    update,
    fetchPage,
    fetchById
  }
}

let userService = userServiceFactory()

export let UsersPage = () => {
  return (
    <Crud
      name="users-crud"
      entityService={userService}
      renderTable={props => <UserTable {...props} />}
      renderCreateForm={props => <UserCreateForm {...props} />}
      renderUpdateForm={props => (
        <UserUpdateForm {...props} initialValues={props.activeRecord} />
      )}
    />
  )
}
