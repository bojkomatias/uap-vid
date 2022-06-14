import NextAuth from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'
import getCollections, { CollectionName } from '../../../utils/bd/getCollection'

import CredentialsProvider from 'next-auth/providers/credentials'

import { compare } from 'bcryptjs'
export default NextAuth({
    session: {
        jwt: true,
    },
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
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
                const users = await getCollections(CollectionName.Users)

                //Find user with the email
                const result = await users.findOne({
                    email: credentials.email,
                })

                //NextAuth maneja el error
                if (!result) {
                    throw new Error('No user found with thar email')
                }

                //Check hased password with DB password
                const checkPassword = await compare(
                    credentials.password,
                    result.password
                )

                if (!checkPassword) {
                    throw new Error("Password doesn't match")
                }
                return {
                    email: result.email,
                    id: result._id,
                    role: result.role,
                }
            },
        }),
    ],
    callbacks: {
        signIn: async ({ user }) => {
            const users = await getCollections(CollectionName.Users)
            const userExist = users.findOne({ email: user.email })
            const updateObject = !user.role
                ? { role: 'new-user', lastLogin: new Date() }
                : { lastLogin: new Date() }

            if (userExist) {
                await users.updateOne(
                    { email: user.email },
                    { $set: updateObject }
                )
            } else {
                users.insertOne({ ...users, updateObject })
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
                const users = await getCollections(CollectionName.Users)
                const user = await users.findOne({ email: token.user.email })
                session.user = { ...token.user, user }
            }
            return session
        },
    },
    secret: 'test',
    jwt: {
        secret: 'test',
        encryption: true,
    },
})
