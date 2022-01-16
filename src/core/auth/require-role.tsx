import React, { FC } from 'react'
import { useAuth, User, UserRole, userRoleLevels } from './auth-provider'

export type RequireRoleProps = {
  role: UserRole
}

export let checkAccess = (
  user: User | undefined,
  role: UserRole | undefined
) => {
  if (!user) {
    return false
  }
  if (!role) {
    return true
  }
  return userRoleLevels.indexOf(role) <= userRoleLevels.indexOf(user.role)
}

export let RequireRole: FC<RequireRoleProps> = ({ role, children }) => {
  let { user } = useAuth()
  let hasAccess = checkAccess(user, role)

  if (!hasAccess) {
    return null
  }

  return <>{children}</>
}
