import { z } from 'zod'
import { ReviewTypeSchema, ReviewVerdictSchema } from './enums'

/////////////////////////////////////////
// REVIEW SCHEMAS
/////////////////////////////////////////

export const ReviewSchema = z.object({
  id: z.string().optional(),
  type: ReviewTypeSchema,
  revised: z.boolean().default(false),
  verdict: ReviewVerdictSchema,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  data: z.string(),
  protocolId: z.string(),
  reviewerId: z.string(),
})

export const ReviewQuestionSchema = z.object({
  active: z.boolean(),
  type: z.string(),
  question: z.string(),
  index: z.number().nullable(),
})
