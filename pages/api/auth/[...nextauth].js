import NextAuth from 'next-auth'
import AzureADB2CProvider from 'next-auth/providers/azure-ad-b2c'
import getCollections, { CollectionName } from '../../../utils/bd/getCollection'

import CredentialsProvider from 'next-auth/providers/credentials'

import { compare } from 'bcryptjs'
export default NextAuth({
    session: {
        jwt: true,
    },
    providers: [
        AzureADB2CProvider({
            tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
            clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
            primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
            authorization: { params: { scope: 'offline_access openid' } },
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'Usuario',
                    type: 'text',
                    placeholder: 'jsmith@uap.edu.ar',
                },
                password: { label: 'Contraseña', type: 'password' },
            },
            async authorize(credentials) {
                const users = getCollections(CollectionName.Users)
                //Find user with the email
                const result = await users.findOne({
                    email: credentials.email,
                })

                //NextAuth maneja el error
                if (!result) {
                    client.close()
                    throw new Error('No user found with the email')
                }

                //Check hased password with DB password
                const checkPassword = await compare(
                    credentials.passowrd,
                    result.passowrd
                )

                if (!checkPassword) {
                    client.close()
                    throw new Error('Password doesnt match')
                }

                return { email: result.email }
            },
        }),
    ],
})
