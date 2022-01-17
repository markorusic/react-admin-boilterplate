import { rest } from 'msw'
import { UserRole } from '../../core/auth'
import { createPage } from '../../core/utils/create-page'
import { UserResponse, UserStatus } from './types'

let usersDataFactory = () => {
  let total = 100
  let data: UserResponse[] = []

  for (let id = 1; id < total + 1; id++) {
    data.push({
      id,
      name: `User ${id}`,
      email: `user${id}@gmail.com`,
      role: Math.random() > 0.5 ? UserRole.admin : UserRole.superAdmin,
      status: Math.random() > 0.8 ? UserStatus.inactive : UserStatus.active,
      createdAt: new Date().toString()
    })
  }

  return data
}

let usersData = usersDataFactory()

export let userHandlers = [
  rest.get('/api/users', (req, res, ctx) => {
    let params = Object.fromEntries(req.url.searchParams)
    return res(ctx.json(createPage(usersData, params)))
  }),
  rest.get('/api/users/:id', (req, res, ctx) => {
    let { id } = req.params
    let user = usersData.find(user => user.id == id)
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
  })
]
