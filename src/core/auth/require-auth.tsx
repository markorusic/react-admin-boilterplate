import React, { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '.'

export let RequireAuth: FC = ({ children }) => {
  let auth = useAuth()
  let location = useLocation()

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
