import { env } from '@/config/env'
import axios from 'axios'

export const http = axios.create({
  baseURL: env.apiBaseUrl,
})
