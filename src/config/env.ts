export type Env = {
  apiBaseUrl: string | undefined
}

export const env: Env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.toString(),
}
