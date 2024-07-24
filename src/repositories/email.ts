'use server'

import type { EmailContentTemplate } from '@prisma/client'
import { prisma } from '../utils/bd'
import { cache } from 'react'

const updateEmail = async (
  data: Omit<EmailContentTemplate, 'id'>,
  id: string
) => {
  try {
    const email = await prisma.emailContentTemplate.update({
      where: { id },
      data,
    })

    return email
  } catch (e) {
    console.log(e)
    return null
  }
}

const getEmails = cache(async () => {
  try {
    return await prisma.emailContentTemplate.findMany()
  } catch (e) {
    return null
  }
})

export { updateEmail, getEmails }
