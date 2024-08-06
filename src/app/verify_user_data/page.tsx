import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import {
  VerifyUserDataForm,
  VerifyUserDataFormMicrosoftUsers,
} from 'modules/verify_user_data/verify-user-data-form'
import Image from 'next/image'
import { Text } from '@components/text'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  return (
    <div className="mx-auto mt-16 max-w-xl rounded-xl border border-gray-200 bg-white p-12 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-black">
      <div className="mx-auto my-8">
        <Image
          src="/UAPazul.png"
          alt="UAP Logo"
          className="mx-auto dark:brightness-0 dark:grayscale dark:invert"
          width={300}
          height={140}
        />
        <Text className="text-center font-bold tracking-tighter !text-primary-950 dark:!text-gray-200">
          VICERRECTORIA DE INVESTIGACION Y DESARROLLO
        </Text>
      </div>
      {!session?.user.email.endsWith('uap.edu.ar') ?
        <VerifyUserDataForm user={session!.user} />
      : <VerifyUserDataFormMicrosoftUsers user={session!.user} />}
    </div>
  )
}
