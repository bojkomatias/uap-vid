/* eslint-disable @next/next/no-server-import-in-page */

import { getProtocolWithResearcher } from '@repositories/protocol'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
    const { from, to, subject, message, template, protocolId } =
        await request.json()

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'nicoskate000@gmail.com',
            pass: 'xypthvctqnialcre',
        },
    })

    const protocol = getProtocolWithResearcher(protocolId)

    console.log(protocol)
    const emailObject = {
        from: from,
        to: to,
        subject: subject,
        text: message,
        html: template,
    }

    transporter.sendMail(emailObject, (err, info) => {
        if (err) {
            return new Response('Error sending email', { status: 500 })
        } else {
            console.log(info)
            return new Response('Sucessfully sent email', { status: 250 })
        }
    })

    return NextResponse.json(request)
}
