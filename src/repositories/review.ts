'use server'

import { Action, ProtocolState, Review, ReviewType } from '@prisma/client'
import { cache } from 'react'
import { prisma } from '../utils/bd'
import { getInitialQuestionsByType } from '@utils/reviewQuestionInitiator'
import { getAllQuestions } from './review-question'
import { emailer } from '@utils/emailer'
import { useCases } from '@utils/emailer/use-cases'
import { updateProtocolStateById } from './protocol'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'

export const getReviewsByProtocol = cache(async (protocolId: string) => {
  const reviews = await prisma.review.findMany({
    include: {
      reviewer: true,
    },
    where: { protocolId },
    orderBy: { createdAt: 'desc' },
  })
  return reviews
})

export const getReviewsByReviewerId = cache(async (reviewerId: string) => {
  const reviews = await prisma.review.findMany({
    where: { reviewerId },
  })
  return reviews
})

export const getProtocolReviewByReviewer = cache(
  async (protocolId: string, reviewerId: string) => {
    const review = await prisma.review.findFirst({
      where: {
        protocolId: protocolId,
        reviewerId: reviewerId,
      },
    })
    return review
  }
)

export const assignReviewerToProtocol = async (
  protocolId: string,
  protocolState: ProtocolState,
  reviewerId: string,
  type: ReviewType
) => {
  try {
    const session = await getServerSession(authOptions)
    const review = await prisma.review.create({
      data: {
        protocolId,
        reviewerId,
        questions: await getInitialQuestionsByType(
          type,
          await getAllQuestions(),
          true
        ),
        type: type,
      },
      include: { reviewer: { select: { email: true } } },
    })

    if (type !== ReviewType.SCIENTIFIC_THIRD) {
      // Update protocol state
      const newStateByReviewType = {
        [ReviewType.METHODOLOGICAL]: ProtocolState.METHODOLOGICAL_EVALUATION,
        [ReviewType.SCIENTIFIC_INTERNAL]: ProtocolState.SCIENTIFIC_EVALUATION,
        [ReviewType.SCIENTIFIC_EXTERNAL]: ProtocolState.SCIENTIFIC_EVALUATION,
      }
      await updateProtocolStateById(
        protocolId,
        type === ReviewType.METHODOLOGICAL ?
          Action.ASSIGN_TO_METHODOLOGIST
        : Action.ASSIGN_TO_SCIENTIFIC,
        protocolState,
        newStateByReviewType[type],
        review.reviewerId
        session!.user.id


      )
    }

    emailer({
      useCase: useCases.onAssignation,
      email: review.reviewer.email,
      protocolId: review.protocolId,
    })

    return review
  } catch (error) {
    return null
  }
}

export const reassignReviewerToProtocol = async (
  reviewId: string,
  protocolId: string,
  reviewerId: string,
  type: ReviewType
) => {
  try {
    const review = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        protocolId,
        reviewerId,
        questions: await getInitialQuestionsByType(
          type,
          await getAllQuestions()
        ),
        type: type,
        verdict: 'NOT_REVIEWED',
      },
      include: { reviewer: { select: { email: true } } },
    })

    emailer({
      useCase: useCases.onAssignation,
      email: review.reviewer.email,
      protocolId: review.protocolId,
    })

    return review
  } catch (error) {
    return null
  }
}

export const updateReview = async (data: Review) => {
  const { id, ...rest } = data
  try {
    const review = await prisma.review.update({
      where: {
        id,
      },
      data: rest,
      include: {
        protocol: {
          select: { researcher: { select: { email: true } } },
        },
      },
    })
    return review
  } catch (error) {
    return null
  }
}

export const markRevised = async (reviewId: string, revised: boolean) => {
  const review = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      revised,
    },
    include: { reviewer: { select: { email: true } } },
  })
  return review
}
