import { authHandlers } from './auth.mock'
import { photoUloadHandlers } from './photo-upload.mock'
import { userHandlers } from './user.mock'

export let handlers = [...authHandlers, ...userHandlers, ...photoUloadHandlers]
