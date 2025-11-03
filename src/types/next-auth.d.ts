import type { User } from '@prisma/client'
import { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession['user']
    impersonating?: {
      originalUser: User & DefaultSession['user']
      isActive: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User & DefaultSession['user']
    impersonating?: {
      originalUser: User & DefaultSession['user']
      isActive: boolean
    }
  }
}
