/* eslint-disable @next/next/no-server-import-in-page */

import { getResearcherEmailByProtocolId } from '@repositories/protocol'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
    const { subject, message, html, protocolId } = await request.json()

    const data = await getResearcherEmailByProtocolId(protocolId)

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'nicoskate000@gmail.com',
            pass: 'xypthvctqnialcre',
        },
    })

    const emailObject = {
        from: 'no-reply@uap.edu.ar',
        to: data?.researcher.email,
        subject: subject,
        text: message,
        html: html,
    }

    transporter.sendMail(emailObject, (err) => {
        if (err) {
            return new Response('Error sending email', { status: 500 })
        } else {
            return new Response('Sucessfully sent email', { status: 250 })
        }
    })

    return NextResponse.json(request)
}
