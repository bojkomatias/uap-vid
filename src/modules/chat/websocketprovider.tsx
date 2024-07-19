import { createContext, useCallback, useContext, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useQueryClient } from '@tanstack/react-query'
import { ChatMessage } from '@prisma/client'

interface ChatMessagesContextType {
  sendMessage: (content: string) => void
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
      const { type, payload } = JSON.parse(lastMessage.data)
      switch (type) {
        case MESSAGE_TYPE.INITIAL_DATA:
          queryClient.setQueryData(queryKey, payload.reverse())
          break
        case MESSAGE_TYPE.NEW_MESSAGE:
          queryClient.setQueryData(queryKey, (oldData: ChatMessage[]) => {
            if (Array.isArray(oldData)) {
              console.log(oldData, payload)
              return [payload, ...oldData]
            }

            return [payload]
          })

          break
        default:
          break
      }
    }
  }, [lastMessage, queryClient])

  const sendMessage = useCallback(
    (content: any) => {
      if (canSendMessages)
        sM(
          JSON.stringify({
            type: MESSAGE_TYPE.SEND_MESSAGE,
            content,
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
