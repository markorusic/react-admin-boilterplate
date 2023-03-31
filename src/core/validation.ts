import { z } from 'zod'
import { t } from './localization'

export const stringToInt = z.preprocess(
  (value) => Math.round(Number(value)),
  z.number(),
)

export const strintToBoolean = z.preprocess(
  (value) => value === 'true',
  z.boolean(),
)

export const zMessage = {
  required: { required_error: t('error.requiredField') },
  type: { invalid_type_error: t('error.type') },
  email: { message: t('error.email') },
}
