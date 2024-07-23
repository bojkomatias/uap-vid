'use server'
import type { ReviewQuestion } from '@prisma/client'
import { cache } from 'react'
import { prisma } from 'utils/bd'

export const getAllQuestionsWithTotalRecords = cache(async () => {
  try {
    return await prisma.$transaction([
      prisma.reviewQuestion.count({}),
      prisma.reviewQuestion.findMany({}),
    ])
  } catch (e) {
    return []
  }
})

export const newQuestion = cache(async (data: Omit<ReviewQuestion, 'id'>) => {
  try {
    const question = prisma.reviewQuestion.create({
      data,
    })
    return question
  } catch (e) {
    return null
  }
})

export const updateQuestion = cache(
  async (data: Omit<ReviewQuestion, 'id'>, id: string) => {
    try {
      const question = prisma.reviewQuestion.update({
        where: { id },
        data,
      })
      return question
    } catch (e) {
      return null
    }
  }
)

export const getAllQuestions = cache(async () => {
  try {
    const result = await prisma.reviewQuestion.findMany({})
    return result
  } catch (e) {
    return []
  }
})