import React, { createContext, FC, useContext } from 'react'
import { ID } from '../types'
import { useStoredState } from '../utils/use-stored-state'

export type UserRole = 'admin' | 'super-admin'

export let userRoleLevels: UserRole[] = ['admin', 'super-admin']

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
      // let { data } = await axios.post<User>('/api/login', credentials)
      await new Promise(r => setTimeout(r, 3000))
      let data: User = { id: 1, name: 'Jon Doe', role: 'super-admin' }
      setUser(data)
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export let useAuth = () => useContext(AuthContext) as AuthContextValue
