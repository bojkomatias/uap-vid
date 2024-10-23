'use client'
import React from 'react'
import { WebSocketMessagesProvider } from './websocketprovider'
import ChatComponent from './ChatForm'
import type { User } from '@prisma/client'

export function ChatFullComponent({
  user,
  protocolId,
}: {
  user: User
  protocolId: string
}) {
  return (
    <WebSocketMessagesProvider queryKey={['messages', protocolId]}>
      <ChatComponent protocolId={protocolId} user={user} />
    </WebSocketMessagesProvider>
  )
}
