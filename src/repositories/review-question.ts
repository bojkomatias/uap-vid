'use server'
import { cache } from 'react'
import { prisma } from 'utils/bd'

export const getAllQuestionsWithTotalRecords = cache(async () => {
  try {
    return await prisma.$transaction([
      prisma.reviewQuestion.count({}),
      prisma.reviewQuestion.findMany({}),
    ])
  } catch (e) {
    console.log(e)
    return []
  }
})

export const getAllQuestions = cache(async () => {
  try {
    const result = await prisma.reviewQuestion.findMany({})
    return result
  } catch (e) {
    console.log(e)
    return []
  }
})
