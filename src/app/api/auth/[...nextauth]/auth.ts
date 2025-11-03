import AzureADProvider from 'next-auth/providers/azure-ad'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import type { User } from '@prisma/client'

import {
  updateUserByEmail,
  saveUser,
  findUserByEmail,
} from '@repositories/user'
import { verifyHashScrypt } from '@utils/hash'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: { signIn: '/' },
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@uap.edu.ar',
        },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        //Find user with the email
        if (!credentials) return null
        const result = await findUserByEmail(credentials?.email)

        //NextAuth maneja el error
        if (!result) {
          throw new Error('No user found with thar email')
        }

        //Check hased password with DB password
        const checkPassword = await verifyHashScrypt(
          credentials.password,
          result.password!
        )

        if (!checkPassword) {
          throw new Error("Password doesn't match")
        }
        return {
          email: result.email,
          id: result.id,
          role: result.role,
        }
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      if (!user || !user.email) return false

      // Normalize email to prevent duplicates
      const normalizedEmail = user.email.toLowerCase().trim()

      const userExist = await findUserByEmail(normalizedEmail)
      if (userExist) {
        await updateUserByEmail(normalizedEmail, {
          ...userExist,
          lastLogin: new Date(),
        })
      } else {
        const newUser = await saveUser({
          name: user.name!,
          email: normalizedEmail,
          image: user.image,
          role: 'RESEARCHER',
          lastLogin: new Date(),
        })

        // If saveUser returns null, it means a duplicate was detected
        if (!newUser) {
          console.error(`Failed to create user with email ${normalizedEmail} - possible duplicate`)
          // Still allow login, they should be able to sign in with existing account
        }
      }
      return true
    },
    jwt: async ({ token, user, trigger }) => {
      // If impersonating, keep the impersonation state and don't override
      if (token.impersonating?.isActive) {
        return token
      }

      // Handle session update trigger
      if (trigger === 'update') {
        return token
      }

      // Initial sign-in: set user data from database
      if (user && user.email) {
        const normalizedEmail = user.email.toLowerCase().trim()
        const userFromDb = await findUserByEmail(normalizedEmail)
        if (userFromDb) token.user = userFromDb
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token.user as User
        // Pass impersonation state to session
        if (token.impersonating) {
          session.impersonating = token.impersonating
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
}
