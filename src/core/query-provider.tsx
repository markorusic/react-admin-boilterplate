import React, { FC } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

export let queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,
      retry: false
    }
  }
})

export let QueryProvider: FC = props => {
  return <QueryClientProvider {...props} client={queryClient} />
}
