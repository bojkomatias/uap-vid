import { createContext, useCallback, useContext, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useQueryClient } from '@tanstack/react-query'
import type { ChatMessage } from '@prisma/client'

interface ChatMessagesContextType {
  sendMessage: (payload: any) => void
  canSendMessages: boolean
}

const ChatMessagesContext = createContext<ChatMessagesContextType | null>(null)

export const WebSocketMessagesProvider = ({
  children,
  queryKey,
}: {
  children: React.ReactNode
  queryKey: any[]
}) => {
  const SOCKET_URL = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL!}/${queryKey[1]}`
  const MESSAGE_TYPE = {
    INITIAL_DATA: 'INITIAL_DATA',
    SEND_MESSAGE: 'SEND_MESSAGE',
    NEW_MESSAGE: 'NEW_MESSAGE',
  }
  const {
    sendMessage: sM,
    lastMessage,
    readyState,
  } = useWebSocket(SOCKET_URL, {
    shouldReconnect: () => true,
  })
  const queryClient = useQueryClient()
  const canSendMessages = readyState === ReadyState.OPEN

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      let parsed
      try {
        parsed = JSON.parse(lastMessage.data)
      } catch {
        return
      }
      const { type, payload } = parsed || {}
      switch (type) {
        case MESSAGE_TYPE.INITIAL_DATA:
          if (Array.isArray(payload)) {
            queryClient.setQueriesData(
              { queryKey, exact: false },
              (old: any) => {
                // Replace only if empty; otherwise, keep existing DB-fetched data
                if (Array.isArray(old) && old.length > 0) return old
                return payload.reverse()
              }
            )
          }
          break
        case MESSAGE_TYPE.NEW_MESSAGE:
          queryClient.setQueriesData(
            { queryKey, exact: false },
            (oldData: ChatMessage[]) => {
              if (Array.isArray(oldData)) {
                return [payload, ...oldData]
              }

              return [payload]
            }
          )

          break
        default:
          break
      }
    }
  }, [lastMessage, queryClient, queryKey])

  const sendMessage = useCallback(
    (payload: any) => {
      if (canSendMessages)
        sM(
          JSON.stringify({
            type: MESSAGE_TYPE.SEND_MESSAGE,
            payload,
          })
        )
    },
    [canSendMessages, sM]
  )

  return (
    <ChatMessagesContext.Provider value={{ sendMessage, canSendMessages }}>
      {children}
    </ChatMessagesContext.Provider>
  )
}

export const useChatMessagesContext = () => useContext(ChatMessagesContext)
