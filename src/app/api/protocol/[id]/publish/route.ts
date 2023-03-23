// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { publishProtocol } from '@repositories/protocol'

export async function PUT(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   const id = params.id
   const protocol = await request.json()
   if (protocol) delete protocol.id
   const updated = await publishProtocol(id)
   if (!updated) {
      return new Response('We cannot publish this protocol', { status: 500 })
   }
   return NextResponse.json({ success: true })
}
