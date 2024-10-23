import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getServerSession } from 'next-auth'
import { getReviewsByReviewerId } from '@repositories/review'
import { Heading, Subheading } from '@components/heading'
import { RolesDictionary } from '@utils/dictionaries/RolesDictionary'
import Image from 'next/image'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@components/description-list'
import { Button } from '@components/button'
import { Text } from '@components/text'
import { NewEmailForm } from 'modules/profile/new-email-form'
import { NewPasswordForm } from 'modules/profile/new-password-form'
import Clipboard from '@elements/clipboard'
import { ReviewerCertificate } from 'modules/profile/reviewer-certificate'
import { Role } from '@prisma/client'

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) return
  const user = session.user
  const reviews = await getReviewsByReviewerId(session.user.id)

  return (
    <>
      <Heading className="print:hidden">Cuenta</Heading>

      <Subheading className="mb-4 print:hidden">
        Datos del usuario que se encuentra autenticado en el sistema.
      </Subheading>
      {(user.role == Role.SCIENTIST || user.role == Role.METHODOLOGIST) && (
        <ReviewerCertificate user={session.user} reviews={reviews} />
      )}
      {user.image ?
        <Image
          className="size-12 rounded-full print:hidden"
          src={user.image}
          alt="Imagen del usuario"
          height={200}
          width={200}
        />
      : null}
      <DescriptionList className="mt-4 print:hidden">
        <DescriptionTerm>UUID</DescriptionTerm>
        <DescriptionDetails className="flex items-center gap-2">
          <span className="font-mono text-xs ">{user.id}</span>
          <Clipboard content={user.id} />
        </DescriptionDetails>
        <DescriptionTerm>Nombre</DescriptionTerm>
        <DescriptionDetails>{user.name}</DescriptionDetails>
        <DescriptionTerm>DNI</DescriptionTerm>
        <DescriptionDetails>{user.dni}</DescriptionDetails>
        <DescriptionTerm>Email</DescriptionTerm>
        <DescriptionDetails>{user.email}</DescriptionDetails>
        <DescriptionTerm>Rol</DescriptionTerm>
        <DescriptionDetails>{RolesDictionary[user.role]}</DescriptionDetails>
      </DescriptionList>

      <Heading className="mt-8 print:hidden">Editar cuenta</Heading>
      {!user.password ?
        <div className="flex items-end justify-between print:hidden">
          <Text className="max-w-3xl">
            La cuenta esta relacionada directamente al a cuenta de Microsoft
            Office. Si desea editar algún dato, debe hacerlo desde Microsoft y
            se verá reflejado aquí la proxima vez que ingrese al sistema.
          </Text>
          <Button
            href={'https://www.office.com/'}
            color="light"
            className="h-10 shrink-0 !gap-0 whitespace-nowrap"
          >
            Editar cuenta en
            <Image
              className="hidden dark:block"
              src={'/blackbackgroundmicrosoft.png'}
              alt="Microsoft Logo"
              width={90}
              height={50}
            />
            <Image
              className="dark:hidden"
              src={'/whitebackgroundmicrosoft.png'}
              alt="Microsoft Logo"
              width={90}
              height={50}
            />
          </Button>
        </div>
      : <div className="print:hidden">
          <NewEmailForm id={user.id} email={user.email} />
          <NewPasswordForm id={user.id} password={user.password} />
        </div>
      }
    </>
  )
}
