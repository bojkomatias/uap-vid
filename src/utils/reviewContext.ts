'use client'
import { createFormContext } from '@mantine/form'
import type { Review } from '@prisma/client'

export const [ReviewProvider, useReviewContext, useReview] =
    createFormContext<Review>()
