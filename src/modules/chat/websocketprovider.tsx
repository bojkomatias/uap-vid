import { createContext, useCallback, useContext, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useQueryClient } from '@tanstack/react-query'

interface ChatMessagesContextType {
  canSendMessages: boolean
  sendMessage: (content: string) => void
}

const ChatMessagesContext = createContext<ChatMessagesContextType | null>(null)
const SOCKET_URL = 'ws://localhost:3001'
const MESSAGE_TYPE = {
  INITIAL_DATA: 'INITIAL_DATA',
  SEND_MESSAGE: 'SEND_MESSAGE',
  NEW_MESSAGE: 'NEW_MESSAGE',
}
export const queryKey = ['messages']

export const ChatMessagesProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
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
          queryClient.setQueryData(queryKey, payload)
          break
        case MESSAGE_TYPE.NEW_MESSAGE:
          queryClient.setQueryData(queryKey, (oldData: any) => {
            if (Array.isArray(oldData)) {
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
    <ChatMessagesContext.Provider value={{ canSendMessages, sendMessage }}>
      {children}
    </ChatMessagesContext.Provider>
  )
}

export const useChatMessagesContext = () => useContext(ChatMessagesContext)
