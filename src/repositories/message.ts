'use server'

import type { ChatMessage } from '@prisma/client'
import { prisma } from '../utils/bd'
import { cache } from 'react'
import { equal } from 'assert'

const saveMessage = async (
  data: Omit<ChatMessage, 'id' | 'createdAt' | 'read'>
) => {
  try {
    const message = await prisma.chatMessage.create({
      data,
    })
    console.log('MESSAGE CREATED:', message)
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

      return totalUnreadMessages
    } catch (e) {}
  }
)

const setMessagesToRead = cache(async (protocolId: string) => {
  try {
    const readMessages = await prisma.chatMessage.updateMany({
      where: { protocolId: { contains: protocolId } },
      data: {
        read: true,
      },
    })
  } catch (e) {
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

export { saveMessage, getMessages, totalMessages }
