import { rest } from 'msw'

export const photoUloadHandlers = [
  rest.post('/api/file-upload', (_, res, ctx) => {
    return res(
      ctx.json({
        src: 'https://via.placeholder.com/600',
      }),
    )
  }),
]
