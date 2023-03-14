import { z } from 'zod'

export const userSchema = z.object({
    id: z.string(),
    email: z.string(),
    id_: z.string().nullable(),
    image: z.string().nullable(),
    lastLogin: z.date().nullable(),
    name: z.string().nullable(),
    password: z.string().nullable(),
    role: z.string(),
})

export type user = z.infer<typeof userSchema>

export default userSchema
