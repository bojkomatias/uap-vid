import { Heading, Subheading } from '@components/heading'
import { ContainerAnimations } from '@elements/container-animations'
import { getEmails } from '@repositories/email'
import EmailsTable from 'modules/emails/EmailsTable'
import React from 'react'

export default async function Page() {
  const emails = await getEmails()
  const randomString = Math.random().toString().split('.')[1].slice(0, 6)
  return (
    <>
      <ContainerAnimations duration={0.4} delay={0}>
        <Heading>Emails</Heading>
        <Subheading>
          Puede editar el asunto y contenido de los emails que salen del sistema
          dependiendo del caso de uso.
        </Subheading>
      </ContainerAnimations>
      <ContainerAnimations duration={0.3} delay={0.1} animation={2}>
        <EmailsTable emails={emails!} randomString={randomString} />
      </ContainerAnimations>
    </>
  )
}
