import React, { FC } from 'react'
import { useAuth, User, UserRole, userRoleLevels } from './auth-provider'

export type RequireRoleProps = {
  role: UserRole
}

export const checkAccess = (
  user: User | undefined,
  role: UserRole | undefined,
) => {
  if (!user) {
    return false
  }
  if (!role) {
    return true
  }
  return userRoleLevels.indexOf(role) <= userRoleLevels.indexOf(user.role)
}

export const RequireRole: FC<RequireRoleProps> = ({ role, children }) => {
  const { user } = useAuth()
  const hasAccess = checkAccess(user, role)

  if (!hasAccess) {
    return null
  }

  return <>{children}</>
}
