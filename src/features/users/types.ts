import { z } from 'zod'
import { UserRole } from '../../core/auth'
import { PageRequest, ID, Identifiable } from '../../core/types'
import { zError } from '../../core/validation'

export enum UserStatus {
  active = 'active',
  inactive = 'inactive'
}

export type UserRequest = PageRequest & {
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
  name: z.string(zError.required),
  email: z.string(zError.required).email(zError.email),
  role: z.nativeEnum(UserRole, zError.required),
  status: z.nativeEnum(UserStatus, zError.required)
})

export type UserMutationRequest = z.infer<typeof UserMutationRequest>
