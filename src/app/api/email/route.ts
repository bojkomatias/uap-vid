/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
    const { email, message } = await request.json()

    console.log(email, message)

    const transporter = nodemailer.createTransport({
        host: 'smtp.uap.edu.ar',
        port: 25,
    })

    transporter.verify(function (error, success) {
        if (error) {
            console.log(error)
        } else {
            console.log('Server is ready to take our messages', success)
        }
    })

    return NextResponse.json(request, { status: 201 })
}
