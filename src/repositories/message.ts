'use server'

import type { ChatMessage } from '@prisma/client'
import { prisma } from '../utils/bd'
import { cache } from 'react'

const saveMessage = async (data: Omit<ChatMessage, 'id' | 'createdAt'>) => {
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

export { saveMessage, getMessages }
