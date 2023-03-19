import { user } from '@prisma/client'
import { RoleType } from '@utils/zod'
import { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user?: user & DefaultSession['user']
    }
}
