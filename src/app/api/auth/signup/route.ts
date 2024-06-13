import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { findUserByEmail, saveUser } from '../../../../repositories/user'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { createHashScrypt } from '@utils/hash'

export async function POST(request: NextRequest) {
    const { name, email, password, role } = await request.json()

    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const sessionRole = session.user.role

    if (sessionRole.toLocaleLowerCase() !== 'admin') {
        return new Response('Unauthorized', { status: 401 })
    }

    //Validate
    if (!email || !email.includes('@') || !password) {
        return new Response('Invalid Data', { status: 422 })
    }
    //Check if user exists
    const checkExisting = await findUserByEmail(email)

    if (checkExisting) {
        return new Response('User already exists', { status: 422 })
    }
    const newUser = await saveUser({
        name,
        email,
        password: await createHashScrypt(password), //Hash password
        role,
    })
    return NextResponse.json(newUser, { status: 201 })
}
