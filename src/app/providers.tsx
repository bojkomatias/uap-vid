'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from '@utils/get-query-client'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  )
}
