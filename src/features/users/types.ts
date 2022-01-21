import { z } from 'zod'
import { UserRole } from '../../core/auth'
import { PageRequest, ID, Identifiable, Sortable } from '../../core/types'
import { zMessage } from '../../core/validation'

export enum UserStatus {
  active = 'active',
  inactive = 'inactive'
}

type SortableUserFields = 'id' | 'name' | 'email' | 'createdAt'

export type UserRequest = PageRequest &
  Sortable<SortableUserFields> & {
    id?: ID
    name?: string
    email?: string
    role?: UserRole
    status?: UserStatus
    createdAt?: string
  }

export type UserResponse = Identifiable & {
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export let UserMutationRequest = z.object({
  id: z.number().or(z.string()).optional(),
  name: z.string(zMessage.required),
  email: z.string(zMessage.required).email(zMessage.email),
  role: z.nativeEnum(UserRole, zMessage.required),
  status: z.nativeEnum(UserStatus, zMessage.required)
})

export type UserMutationRequest = z.infer<typeof UserMutationRequest>
