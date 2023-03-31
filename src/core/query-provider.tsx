import React, { FC } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,
      retry: false,
    },
  },
})

export const QueryProvider: FC = (props) => {
  return <QueryClientProvider {...props} client={queryClient} />
}
