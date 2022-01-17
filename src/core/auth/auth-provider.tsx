import React, { createContext, FC, useContext } from 'react'
import axios from 'axios'
import { ID } from '../types'
import { useStoredState } from '../utils/use-stored-state'

export enum UserRole {
  admin = 'admin',
  superAdmin = 'super-admin'
}

export let userRoleLevels: UserRole[] = [UserRole.admin, UserRole.superAdmin]

export type User = {
  id: ID
  name: string
  role: UserRole
}

type AuthContextValue = {
  user?: User
  login: (credentials: any) => Promise<any>
  logout: VoidFunction
}
let AuthContext = createContext<AuthContextValue | null>(null)

export let AuthProvider: FC = ({ children }) => {
  let [user, setUser] = useStoredState<User | undefined>('user', undefined)

  let value: AuthContextValue = {
    user,
    logout: () => setUser(undefined),
    login: async credentials => {
      let { data } = await axios.post<User>('/api/login', credentials)
      setUser(data)
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export let useAuth = () => useContext(AuthContext) as AuthContextValue
