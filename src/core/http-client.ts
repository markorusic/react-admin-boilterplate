import axios from 'axios'

export let http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.toString() ?? ''
})

console.log(import.meta.env.VITE_API_BASE_URL?.toString() ?? '')
