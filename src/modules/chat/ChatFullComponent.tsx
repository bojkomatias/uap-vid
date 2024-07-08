'use client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChatMessagesProvider } from './WebSocketProvider'
import ChatComponent from './ChatForm'
import type { User } from '@prisma/client'
export default function ChatFullComponent({
  user,
  protocolId,
}: {
  user: User
  protocolId: string
}) {
  const queryClient = new QueryClient({})

  return (
    <QueryClientProvider client={queryClient}>
      <ChatMessagesProvider queryKey={['messages', protocolId]}>
        <ChatComponent protocolId={protocolId} user={user} />
      </ChatMessagesProvider>
    </QueryClientProvider>
  )
}
