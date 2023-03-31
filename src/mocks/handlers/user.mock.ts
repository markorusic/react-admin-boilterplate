import { rest } from 'msw'
import { UserRole } from '@/core/auth'
import { createPage } from '@/core/utils/create-page'
import { UserResponse, UserStatus } from '@/features/users/user-types'

const userDataFactory = () => {
  const total = 100
  const data: UserResponse[] = []

  for (let id = 1; id < total + 1; id++) {
    data.push({
      id,
      name: `User ${id}`,
      email: `user${id}@gmail.com`,
      role: Math.random() > 0.8 ? UserRole.superAdmin : UserRole.admin,
      status: Math.random() > 0.8 ? UserStatus.inactive : UserStatus.active,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    })
  }

  return data
}

const userData = userDataFactory()

export const userHandlers = [
  rest.get('/api/users', (req, res, ctx) => {
    const params = Object.fromEntries(req.url.searchParams)
    return res(ctx.json(createPage(userData, params)))
  }),
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params
    const user = userData.find((user) => user.id == id)
    if (!user) {
      return res(ctx.status(404))
    }
    return res(ctx.json(user))
  }),
  rest.post('/api/users', (req, res, ctx) => {
    return res(ctx.json(req.body))
  }),
  rest.put('/api/users', (req, res, ctx) => {
    return res(ctx.json(req.body))
  }),
]
