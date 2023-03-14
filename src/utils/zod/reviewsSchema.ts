import { z } from 'zod'

export const reviewsSchema = z.object({
    id: z.string(),
})

export type reviews = z.infer<typeof reviewsSchema>

export default reviewsSchema
