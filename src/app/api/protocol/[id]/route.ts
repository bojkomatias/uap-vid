// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { updateProtocolById } from '@repositories/protocol'

export async function PUT(request: NextRequest, { params }: any) { //I cannot find the type for params https://beta.nextjs.org/docs/routing/route-handlers#dynamic-route-segments
   const id = params.id
   const protocol = await request.json()
   if (protocol) delete protocol.id
   const updated = await updateProtocolById(id, protocol)
   if (!updated) {
      return new Response("We cannot update the protocol", { status: 500 })
   }
   return NextResponse.json({ sucess: true })
}
