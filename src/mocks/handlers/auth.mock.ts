import { rest } from 'msw'
import { User, UserRole } from '@/core/auth'

export const authHandlers = [
  rest.post('/api/login', (_, res, ctx) => {
    const user: User = { id: 1, name: 'Jon Doe', role: UserRole.admin }
    return res(ctx.json(user))
  }),
]
