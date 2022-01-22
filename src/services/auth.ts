import { AuthFn, User } from '@/core/auth'
import { http } from '@/core/http-client'

export let auth: AuthFn = async credentials => {
  let { data } = await http.post<User>('/api/login', credentials)
  return data
}
