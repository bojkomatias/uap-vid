/* eslint-disable no-constant-condition */
'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useChatMessagesContext } from './WebSocketProvider'
import { getMessages, saveMessage } from '@repositories/message'
import { Fieldset } from '@components/fieldset'
import { FormInput } from '@shared/form/form-input'
import { FormButton } from '@shared/form/form-button'
import type { User } from '@prisma/client'
import { ChatPopover } from './Popover'

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
    createdAt: Date
    user: { name: string }
  }
  type: 'SEND_MESSAGE'
}

export default function ChatForm({
  user,
  protocolId,
}: {
  user: User
  protocolId: string
}) {
  const [message, setMessage] = useState('')

  const { sendMessage, canSendMessages } =
    useChatMessagesContext() as ChatMessagesContextType

  const { data: messages } = useQuery({
    queryKey: ['messages', protocolId],
    queryFn: async () => {
      return await getMessages(protocolId)
    },
    initialData: [],
  })

  const sendNewMessage = useMutation({
    mutationFn: async (newMessage: string) => {
      const savedMessage = await saveMessage({
        content: newMessage,
        thread: 'Test',
        protocolId: protocolId,
        userId: user.id,
      })

      if (savedMessage) {
        const websocket_new_message: SendMessageType = {
          content: {
            content: newMessage,
            thread: 'Test',
            protocolId: protocolId,
            userId: user.id,
            createdAt: new Date(),
            user: { name: user.name },
          },
          type: 'SEND_MESSAGE',
        }
        sendMessage(JSON.stringify(websocket_new_message))
      }
      return savedMessage
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
    <ChatPopover>
      <div className="flex flex-col rounded-xl">
        <div className="flex max-h-[60vh] flex-col-reverse overflow-auto">
          <div className="w-full space-y-4 pt-4">
            {messages?.toReversed().map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.userId == user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3/4 rounded p-2 ${
                    msg.userId == user.id ?
                      'bg-primary-950 text-white'
                    : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="text-sm">
                    <h1
                      className={`
                           text-xs ${
                             msg.userId == user.id ?
                               'text-gray-300'
                             : 'text-gray-500'
                           }`}
                    >
                      {msg.user?.name}
                    </h1>
                    <div className="flex items-end gap-4">
                      <p className="font-semibold">{msg.content}</p>
                      <p className="text-right text-xs">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sticky bottom-0 bg-white shadow-lg">
          <form onSubmit={onSubmit} className="flex flex-col gap-2 ">
            <Fieldset className="!mt-0">
              <FormInput
                type="text"
                label=""
                value={message}
                className=" text-xs"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMessage(e.target.value)
                }
                placeholder="Escriba un mensaje..."
              />
            </Fieldset>
            <FormButton isLoading={sendNewMessage.isPending}>Enviar</FormButton>
          </form>
        </div>
      </div>
    </ChatPopover>
  )
}
