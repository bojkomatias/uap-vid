import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getServerSession } from 'next-auth'
import { ReviewerCertificatePDF } from 'modules/profile/reviewer-certificate'
import { getReviewsByReviewerId } from '@repositories/review'
import { ProfileInfo } from 'modules/profile/profile-info'
import { Role } from '@prisma/client'
import { Heading, Subheading } from '@components/heading'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import Image from 'next/image'
import { UserCircle } from 'tabler-icons-react'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@components/description-list'
import { Button } from '@components/button'
import { Text } from '@components/text'

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) return
  const user = session.user
  const reviews = await getReviewsByReviewerId(session.user.id)

  return (
    <>
      <Heading>Cuenta</Heading>
      <Subheading className="mb-4">
        Datos del usuario con el cual se encuentra autenticado en el sistema.
      </Subheading>
      {user.image ?
        <Image
          className="size-12 rounded-full"
          src={user.image}
          alt="Imagen del usuario"
          height={200}
          width={200}
        />
      : null}
      <DescriptionList className="mt-4">
        <DescriptionTerm>UUID</DescriptionTerm>
        <DescriptionDetails>
          <span className="font-mono text-xs">{user.id}</span>
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

      <Heading className="mt-8">Editar cuenta</Heading>
      {!user.password ?
        <div className="flex items-end justify-between">
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
              src={'/whitebackgroundmicrosoft.png'}
              alt="Microsoft Logo"
              width={90}
              height={50}
            />
          </Button>
        </div>
      : <ProfileInfo user={user} />}

      {/*  Since not all users do evaluations/reviews, I'm checking for the user role before loading the component, therefore, improving the load time of the page. */}
      {(user.role == Role.SCIENTIST || user.role == Role.METHODOLOGIST) && (
        <ReviewerCertificatePDF user={session.user} reviews={reviews} />
      )}
    </>
  )
}
