import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useChatMessagesContext } from './websocketprovider'
import { getMessages, saveMessage } from '@repositories/message'
import type { ChatMessage } from '@prisma/client'

interface ChatMessagesContextType {
  canSendMessages: boolean
  sendMessage: (content: string) => void
}

type SendMessageType = {
  content: {
    content: string
    thread: string
    userId: string
    protocolId: string
  }
  type: 'SEND_MESSAGE'
}

export default function ChatForm() {
  const [message, setMessage] = useState('')
  const queryClient = useQueryClient()

  const { sendMessage, canSendMessages } =
    useChatMessagesContext() as ChatMessagesContextType

  const { data: messages = [] } = useQuery<ChatMessage[] | null>({
    queryKey: ['messages'],
    queryFn: async () => await getMessages('111'),
    initialData: [],
    staleTime: Infinity,
  })

  const sendNewMessage = useMutation({
    mutationFn: async (newMessage: string) => {
      const savedMessage = await saveMessage({
        content: newMessage,
        thread: 'Test',
        protocolId: '111',
        userId: '222',
      })

      if (savedMessage) {
        const websocket_new_message: SendMessageType = {
          content: {
            content: newMessage,
            thread: 'Test',
            protocolId: '111',
            userId: '222',
          },
          type: 'SEND_MESSAGE',
        }
        sendMessage(JSON.stringify(websocket_new_message))
      }
      return savedMessage
    },
    onSuccess: (savedMessage) => {
      if (savedMessage) {
        queryClient.setQueryData<ChatMessage[]>(
          ['messages'],
          (oldMessages = []) => {
            return [savedMessage, ...oldMessages]
          }
        )
      }
    },
  })

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (message.trim()) {
      sendNewMessage.mutate(message)
      setMessage('')
    }
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">Chat Messages</h1>
      <form onSubmit={onSubmit} className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded border p-2"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          disabled={
            !canSendMessages || !message.trim() || sendNewMessage.isPending
          }
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
        >
          {sendNewMessage.isPending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      <div className="space-y-4">
        {messages?.map((msg: ChatMessage) => (
          <div key={msg.id} className="rounded border p-2">
            <div className="text-sm text-gray-500">
              <h1 className="text-xs font-bold">UserID: {msg.userId}</h1>
              <p className="font-semibold text-primary-950">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
