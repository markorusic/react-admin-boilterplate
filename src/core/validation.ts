import { z } from 'zod'
import { t } from './localization'

export let stringToInt = z.preprocess(
  value => Math.round(Number(value)),
  z.number()
)

export let strintToBoolean = z.preprocess(
  value => value === 'true',
  z.boolean()
)

export let zError = {
  required: { required_error: t('error.requiredField') },
  type: { invalid_type_error: t('error.type') },
  email: { message: t('error.email') }
}
