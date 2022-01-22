import React, { createContext, FC, useContext } from 'react'
import { useStoredState } from '../utils/use-stored-state'
import { ID } from '../types'

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

export type AuthFn = (credentials: any) => Promise<User>
export type AuthProviderProps = {
  auth: AuthFn
}

export let AuthProvider: FC<AuthProviderProps> = ({ auth, children }) => {
  let [user, setUser] = useStoredState<User | undefined>('user', undefined)

  let value: AuthContextValue = {
    user,
    logout: () => setUser(undefined),
    login: async credentials => {
      let data = await auth(credentials)
      setUser(data)
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export let useAuth = () => useContext(AuthContext) as AuthContextValue
