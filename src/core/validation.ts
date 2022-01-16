import { z } from 'zod'

export const stringToInt = z.preprocess(
  value => Math.round(Number(value)),
  z.number()
)

export const strintToBoolean = z.preprocess(
  value => value === 'true',
  z.boolean()
)
