// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { findUserByEmail, saveUser } from '../../../../repositories/user'

export async function POST(request: NextRequest) {
   const { name, email, password, role } = await request.json()
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
      password: await hash(password, 12), //Hash password
      role,
   })
   return NextResponse.json(newUser, { status: 201 })
}