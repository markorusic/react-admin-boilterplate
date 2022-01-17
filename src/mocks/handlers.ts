import { rest } from 'msw'
import { User, UserRole } from '../core/auth'
import { userHandlers } from '../features/users/user-service.mock'

export let handlers = [
  ...userHandlers,
  rest.post('/api/login', (_, res, ctx) => {
    let user: User = { id: 1, name: 'Jon Doe', role: UserRole.admin }
    return res(ctx.json(user))
  })
]
