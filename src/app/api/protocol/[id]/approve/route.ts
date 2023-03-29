// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { changeProtocolState } from '@repositories/protocol'
import { State } from '@prisma/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const protocol = await request.json()
  if (protocol) delete protocol.id
  const updated = await changeProtocolState(id, State.ON_GOING)
  if (!updated) {
    return new Response('We cannot approve this protocol', { status: 500 })
  }
  return NextResponse.json({ success: true })
}
