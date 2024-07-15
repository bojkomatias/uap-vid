'use client'
import React from 'react'
import { WebSocketMessagesProvider } from './WebSocketProvider'
import ChatComponent from './ChatForm'
import type { User } from '@prisma/client'
export default function ChatFullComponent({
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
