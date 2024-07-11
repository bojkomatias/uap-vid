'use server'
import { cache } from 'react'
import { prisma } from 'utils/bd'

export const getAllQuestions = cache(async () => {
  try {
    const result = prisma.reviewQuestion.findMany()
    console.log(result)

    return result
  } catch (e) {
    console.log(e)
    return null
  }
})
