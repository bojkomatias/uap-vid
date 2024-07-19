'use server'

import type { ChatMessage } from '@prisma/client'
import { prisma } from '../utils/bd'
import { cache } from 'react'

const saveMessage = async (
  data: Omit<ChatMessage, 'id' | 'createdAt' | 'read'>
) => {
  try {
    const message = await prisma.chatMessage.create({
      data,
    })
    console.log(message)
    return message
  } catch (e) {
    console.error('Error creating message:', e)
    return null
  }
}

const getMessages = cache(async (protocolId: string, n: number) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { protocolId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: n,
    })

    return messages
  } catch (e) {
    console.error('Error fetching messages:', e)
    return null
  }
})
const getTotalUnreadMessages = cache(
  async (protocolId: string, userId: string) => {
    try {
      const totalUnreadMessages = await prisma.chatMessage.count({
        where: { protocolId: protocolId, userId: { not: userId }, read: false },
      })
      console.log('UNREAD MESSAGES:', totalUnreadMessages)
      return totalUnreadMessages
    } catch (e) {
      console.log(e)
      return null
    }
  }
)

const setMessagesToRead = cache(async (protocolId: string, userId: string) => {
  try {
    const updatedMessages = await prisma.chatMessage.updateMany({
      where: { protocolId: protocolId, userId: { not: userId }, read: false },
      data: {
        read: true,
      },
    })
    return updatedMessages
  } catch (e) {
    console.log(e)
    return null
  }
})

const totalMessages = cache(async (protocolId: string) => {
  try {
    const messages = await prisma.chatMessage.count({
      where: { protocolId },
    })

    return messages
  } catch (e) {
    console.error('Error fetching messages count:', e)
    return null
  }
})

export {
  saveMessage,
  getMessages,
  totalMessages,
  getTotalUnreadMessages,
  setMessagesToRead,
}
