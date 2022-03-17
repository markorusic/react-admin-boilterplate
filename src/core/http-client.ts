import { env } from '@/config/env'
import axios from 'axios'

export let http = axios.create({
  baseURL: env.apiBaseUrl
})
