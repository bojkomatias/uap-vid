/* eslint-disable @next/next/no-server-import-in-page */

import { ROLE } from '@utils/zod'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { createProtocol, getProtocolByRol } from '../../../repositories/protocol'
import prisma from '../../../utils/prismaClient'
export async function POST(request: NextRequest) {
   const data = await request.json()
   const created = await createProtocol({
      createdAt: new Date(),
      ...data
   })

   if (!created) {
      return new Response('We cannot create the protocol', { status: 500 })
   }

   return NextResponse.json(created)
}

export async function GET() {
   try {
      const protocols = await (await prisma).protocol.findMany() //await getProtocolByRol(ROLE.METHODOLOGIST, "62cf537849c524d1908a7af2")
      console.log(protocols);

      return NextResponse.json(protocols)
   } catch (e) {
      return NextResponse.json(e, { status: 500 })
   }
}
