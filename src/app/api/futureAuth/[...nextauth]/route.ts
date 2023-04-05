import { compare } from 'bcryptjs'
import {
    updateUserByEmail,
    saveUser,
    findUserByEmail,
} from '../../../../repositories/user'
import AzureADProvider from 'next-auth/providers/azure-ad'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import type { User } from '@prisma/client'

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
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
                const result = await findUserByEmail(credentials!.email)

                //NextAuth maneja el error
                if (!result) {
                    throw new Error('No user found with thar email')
                }

                //Check hased password with DB password
                const checkPassword = await compare(
                    credentials!.password,
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
            if (!user || !user.email || !user.name) return false
            const userExist = await findUserByEmail(user.email)
            if (userExist) {
                await updateUserByEmail(user.email!, {
                    ...userExist,
                    lastLogin: new Date(),
                })
            } else {
                await saveUser({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: 'RESEARCHER',
                    lastLogin: new Date(),
                })
            }
            return true
        },
        jwt: ({ token, user }) => {
            if (user) {
                token.user = user
            }
            return token
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user = token.user as User
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
}

const handler = NextAuth(authOptions)
export default handler
// export default { handler as GET, handler as POST }
