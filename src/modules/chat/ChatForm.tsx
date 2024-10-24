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
import { FieldGroup } from '@components/fieldset'
import { FormInput } from '@shared/form/form-input'
import type { User } from '@prisma/client'
import { ChatPopover } from './Popover'
import { Button } from '@components/button'
import { Loader, Send } from 'tabler-icons-react'
import { Text } from '@components/text'

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
    gcTime: 1000,
    staleTime: 1000,
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
        await refetch()
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
              {messages && messages?.length > 9 && (
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
                        'bg-primary-950 text-gray-100'
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                    }`}
                  >
                    <div className="text-sm">
                      <h1
                        className={`
                       text-xs ${
                         msg.userId == user.id ?
                           'text-right text-gray-300'
                         : 'text-gray-500 dark:text-gray-200'
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
                         : 'text-gray-500 dark:text-gray-200'
                       }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          : <Text className="mb-1 rounded-lg border px-3 py-5 text-sm text-gray-400 dark:border-white/10">
              Chat vacío. Puede comenzar una nueva conversación enviando un
              mensaje nuevo.
            </Text>
          }
        </div>
        <div className="sticky bottom-0 bg-white">
          <form onSubmit={onSubmit} className="flex flex-col gap-2 ">
            <FieldGroup className="!mt-0 flex items-center gap-1 space-y-0 dark:lg:bg-gray-900 ">
              <FormInput
                type="text"
                label=""
                value={message}
                className="!mt-0 grow text-xs "
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMessage(e.target.value)
                }
                placeholder="Escriba un mensaje..."
              />
              <Button
                className="!-mb-1"
                outline
                type="submit"
                disabled={!canSendMessages}
              >
                <Send
                  data-slot="icon"
                  className="!size-4.5 !mr-0.5 rotate-45 text-gray-500"
                />
              </Button>
            </FieldGroup>
          </form>
        </div>
      </div>
    </ChatPopover>
  )
}
