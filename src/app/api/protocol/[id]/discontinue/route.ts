
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateProtocolStateById } from '@repositories/protocol'
import { logProtocolUpdate } from '@utils/logger'
import { canExecute } from '@utils/scopes'
import { ProtocolState } from '@prisma/client'
import { getToken } from 'next-auth/jwt'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req: request })
  const id = params.id
  const protocol = await request.json()
  if (token && canExecute('DISCONTINUE', token.user.role, protocol.state)) {
    const updated = await updateProtocolStateById(id, ProtocolState.DISCONTINUED)

    await logProtocolUpdate({
      user: token.user,
      fromState: protocol.state,
      toState: ProtocolState.DISCONTINUED,
      protocolId: id,
    })

    if (!updated) {
      return new Response('We cannot accept this protocol', {
        status: 500,
      })
    }
    return NextResponse.json({ success: true })
  }
  return new Response('Unauthorized', { status: 401 })
}
