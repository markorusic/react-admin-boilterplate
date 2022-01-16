import { z } from 'zod'

export let stringToInt = z.preprocess(
  value => Math.round(Number(value)),
  z.number()
)

export let strintToBoolean = z.preprocess(
  value => value === 'true',
  z.boolean()
)
