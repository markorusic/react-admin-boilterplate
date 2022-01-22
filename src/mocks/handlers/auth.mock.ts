import { rest } from 'msw'
import { User, UserRole } from '@/core/auth'

export let authHandlers = [
  rest.post('/api/login', (_, res, ctx) => {
    let user: User = { id: 1, name: 'Jon Doe', role: UserRole.admin }
    return res(ctx.json(user))
  })
]
