import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateProtocolStateById } from '@repositories/protocol'
import { logProtocolUpdate } from '@utils/logger'
import { canExecute } from '@utils/scopes'
import { Action, ProtocolState } from '@prisma/client'
import { getToken } from 'next-auth/jwt'
import { useCases } from '@utils/emailer/use-cases'
import { emailer } from '@utils/emailer'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req: request })
  const id = params.id
  const protocol = await request.json()
  if (token && canExecute(Action.APPROVE, token.user.role, protocol.state)) {
    const updated = await updateProtocolStateById(
      id,
      protocol.state,
      ProtocolState.ON_GOING,
      token.user.id
    )

    if (updated) {
      emailer({
        useCase: useCases.onApprove,
        email: updated.data?.researcher.email ?? '',
        protocolId: updated.data?.id,
      })
    } else {
      console.log('No se envió el email al investigador')
    }
    await logProtocolUpdate({
      userId: token.user.id,
      fromState: ProtocolState.ACCEPTED,
      toState: ProtocolState.ON_GOING,
      protocolId: id,
    })

    if (!updated) {
      return new Response('We cannot approve this protocol', {
        status: 500,
      })
    }
  }
  return NextResponse.json({ success: true })
}
