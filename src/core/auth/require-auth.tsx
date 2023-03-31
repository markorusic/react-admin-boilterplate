import React, { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '.'

export const RequireAuth: FC = ({ children }) => {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
