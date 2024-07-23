/* eslint-disable no-constant-condition */
'use client'
import React, { useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useChatMessagesContext } from './websocketprovider'
import {
  getMessages,
  getTotalUnreadMessages,
  saveMessage,
  setMessagesToRead,
} from '@repositories/message'
import { Fieldset } from '@components/fieldset'
import { FormInput } from '@shared/form/form-input'
import { FormButton } from '@shared/form/form-button'
import type { User } from '@prisma/client'
import { ChatPopover } from './Popover'
import { Button } from '@components/button'
import { Loader } from 'tabler-icons-react'

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
    read: boolean
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
  const [take, setTake] = useState(10)
  const chatcontainer = useRef(null)

  const { sendMessage, canSendMessages } =
    useChatMessagesContext() as ChatMessagesContextType

  const {
    data: messages,
    refetch,
    isFetching,
  } = useQuery({
    refetchOnMount: 'always',
    queryKey: ['messages', protocolId],
    queryFn: async () => {
      return await getMessages(protocolId, take)
    },
    initialData: [],
  })

  const { data: unreadMessages, refetch: refetchUnreadMessages } = useQuery({
    refetchOnWindowFocus: 'always',
    refetchOnMount: 'always',
    gcTime: 1000,
    staleTime: 1000,

    queryKey: ['unreadMessages', protocolId],
    queryFn: async () => {
      return await getTotalUnreadMessages(protocolId, user.id)
    },
    initialData: 0,
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
            read: false,
            user: { name: user.name },
          },
          type: 'SEND_MESSAGE',
        }
        sendMessage(JSON.stringify(websocket_new_message))
      }
      return savedMessage
    },
  })

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await refetchUnreadMessages()
    if (message.trim()) {
      sendNewMessage.mutate(message)
      setMessage('')
    }
  }

  return (
    <ChatPopover
      callbackFn={async () => {
        await setMessagesToRead(protocolId, user.id)
        await refetchUnreadMessages()
      }}
      totalUnreadMessages={unreadMessages!}
    >
      <div className="flex flex-col rounded-xl">
        <div
          ref={chatcontainer}
          className="flex max-h-[60vh] flex-col-reverse overflow-auto"
        >
          {messages!.length > 0 ?
            <div className="w-full space-y-4 pt-4">
              {messages && messages.length > 9 && (
                <Button
                  onClick={() => {
                    setTake(take + 10)
                    setTimeout(() => {
                      refetch()
                    }, 100)
                  }}
                >
                  {isFetching ?
                    <Loader className="animate-spin" />
                  : 'Cargar más mensajes'}
                </Button>
              )}{' '}
              {messages?.toReversed().map((msg, idx) => (
                <div
                  key={msg.protocolId.concat(idx.toString())}
                  className={` flex pb-2 ${msg.userId == user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[60vw] rounded p-2 md:max-w-[30vw] xl:max-w-[25vw] ${
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
                           'text-right text-gray-300'
                         : 'text-gray-500'
                       }`}
                      >
                        {msg.user?.name}
                      </h1>

                      <p className="break-words font-semibold">{msg.content}</p>
                    </div>
                    <p
                      className={`
                       text-xs ${
                         msg.userId == user.id ?
                           'text-right text-gray-300'
                         : 'text-gray-500'
                       }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          : <p className="mb-1 rounded-lg border px-3 py-5 text-sm text-gray-400">
              Chat vacío. Puede comenzar una nueva conversación enviando un
              mensaje nuevo.
            </p>
          }
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
            <Button type="submit" disabled={!canSendMessages}>
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </ChatPopover>
  )
}
