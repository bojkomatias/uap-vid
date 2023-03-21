/* eslint-disable @next/next/no-server-import-in-page */

import { NextRequest, NextResponse } from 'next/server'
import { createProtocol } from '../../../repositories/protocol'

export async function POST(request: NextRequest) {
   const data = await request.json()
   const created = await createProtocol({
      createdAt: new Date(),
      ...data
   })

   if (!created) {
      return NextResponse.error() //This return a 0 status code I don't get it
   }

   return NextResponse.json(created)
}

