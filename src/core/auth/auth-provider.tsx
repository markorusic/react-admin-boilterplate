import React, { createContext, FC, useContext } from 'react'
import { useStoredState } from '../utils/use-stored-state'
import { ID } from '../types'

export enum UserRole {
  admin = 'admin',
  superAdmin = 'super-admin',
}

export const userRoleLevels: UserRole[] = [UserRole.admin, UserRole.superAdmin]

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
const AuthContext = createContext<AuthContextValue | null>(null)

export type AuthFn = (credentials: any) => Promise<User>
export type AuthProviderProps = {
  auth: AuthFn
}

export const AuthProvider: FC<AuthProviderProps> = ({ auth, children }) => {
  const [user, setUser] = useStoredState<User | undefined>('user', undefined)

  const value: AuthContextValue = {
    user,
    logout: () => setUser(undefined),
    login: async (credentials) => {
      const data = await auth(credentials)
      setUser(data)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext) as AuthContextValue
