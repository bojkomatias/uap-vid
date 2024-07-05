import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import {
  VerifyUserDataForm,
  VerifyUserDataFormMicrosoftUsers,
} from 'modules/verify_user_data/verify-user-data-form'

export default async function Page() {
  const session = await getServerSession(authOptions)
  return !session?.user.email.endsWith('uap.edu.ar') ?
      <VerifyUserDataForm user={session!.user} />
    : <VerifyUserDataFormMicrosoftUsers user={session!.user} />
}
