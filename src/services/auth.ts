import { AuthFn, User } from '@/core/auth'
import { http } from '@/core/http-client'

export const auth: AuthFn = async (credentials) => {
  const { data } = await http.post<User>('/api/login', credentials)
  return data
}
