'use client'
import { createFormContext } from '@mantine/form'
import type { Review } from '@prisma/client'

export type Question = { id: string; approved: boolean; comment: string }

export const [ReviewProvider, useReviewContext, useReview] = createFormContext<
    Review & { questions: Question[] }
>()
