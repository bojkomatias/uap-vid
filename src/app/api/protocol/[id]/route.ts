import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  updateProtocolById,
  updateProtocolStateById,
} from '@repositories/protocol'
import { ProtocolState } from '@prisma/client'
import { logProtocolUpdate } from '@utils/logger'
import { getToken } from 'next-auth/jwt'
import { canExecute } from '@utils/scopes'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req: request })

  const id = params.id
  const protocol = await request.json()

  if (
    token &&
    canExecute(
      token.user.id === protocol.researcherId ? 'EDIT_BY_OWNER' : 'EDIT',
      token.user.role,
      protocol.state
    )
  ) {
    if (protocol) delete protocol.id
    const updated = await updateProtocolById(id, protocol)

    if (!updated) {
      return new Response('We cannot update the protocol', {
        status: 500,
      })
    }
    return NextResponse.json({ success: true })
  }
  return new Response('Not allowed', { status: 401 })
}

// Patches researcher
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req: request })
  if (token!.user.role !== 'ADMIN')
    return new Response('Not allowed', { status: 401 })

  const id = params.id
  const data = await request.json()

  const patched = await updateProtocolById(id, data)
  if (!patched) {
    return new Response('We could not patch the researcher', {
      status: 500,
    })
  }
  return NextResponse.json({ success: true })
}
