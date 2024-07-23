import { getEmails } from '@repositories/email'
import EmailsTable from 'modules/emails/EmailsTable'
import React from 'react'

export default async function Page() {
  const emails = await getEmails()
  return <EmailsTable emails={emails!} />
}
