import { getEmails } from '@repositories/email'
import EmailsTable from 'modules/emails/EmailsTable'
import React from 'react'

export default async function Page() {
  const emails = await getEmails()
  const randomString = Math.random().toString().split('.')[1].slice(0, 6)
  return <EmailsTable emails={emails!} randomString={randomString} />
}
