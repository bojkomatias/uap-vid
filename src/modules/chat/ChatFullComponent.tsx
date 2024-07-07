'use client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChatMessagesProvider } from './websocketprovider'
import ChatComponent from './ChatForm'
export default function ChatFullComponent() {
  const queryClient = new QueryClient({})

  return (
    <QueryClientProvider client={queryClient}>
      <ChatMessagesProvider>
        <ChatComponent />
      </ChatMessagesProvider>
    </QueryClientProvider>
  )
}
