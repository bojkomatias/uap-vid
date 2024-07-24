import { emailer, getEmailContent, getEmailSubjects } from '@utils/emailer'
import { useCases } from '@utils/emailer/use-cases'
import { NextResponse } from 'next/server'

export async function GET() {
  const email = await emailer({
    useCase: useCases.changeUserEmail,
    email: 'contact@nicohorn.com',
    randomString: '11111',
  })

  console.log(email)
  return NextResponse.json({ hello: 'world' })
}
