import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ProtocolState } from '@prisma/client'
import { updateProtocolStateById } from '@repositories/protocol'
import { logProtocolUpdate } from '@utils/logger'
import { getToken } from 'next-auth/jwt'
import { emailer, useCases } from '@utils/emailer'
import { getSecretariesEmailsByAcademicUnit } from '@repositories/academic-unit'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req: request })
  const id = params.id
  const protocol = await request.json()

  if (protocol) delete protocol.id
  const updated = await updateProtocolStateById(id, ProtocolState.PUBLISHED)

  const secretariesEmails = async (academicUnits: string[]) => {
    const secretaryEmailPromises = academicUnits.map(async (s) => {
      return await getSecretariesEmailsByAcademicUnit(s)
    })

    const secretaryEmails = (await Promise.all(secretaryEmailPromises)).flat()

    return secretaryEmails
      .map((s) => {
        return s?.secretaries.map((e) => {
          return e.email
        })
      })
      .flat()
  }

  if (updated) {
    const emails = await secretariesEmails(
      updated.sections.identification.sponsor
    )
    emails.forEach((email) => {
      emailer({
        useCase: useCases.onPublish,
        email: email!,
        protocolId: updated.id,
      })
    })
  } else {
    console.info('No se pudo enviar emails a los secretarios de investigación')
  }

  await logProtocolUpdate({
    user: token!.user,
    fromState: ProtocolState.DRAFT,
    toState: ProtocolState.PUBLISHED,
    protocolId: id,
  })

  if (!updated) {
    return new Response('We cannot publish this protocol', { status: 500 })
  }
  return NextResponse.json({ success: true })
}
