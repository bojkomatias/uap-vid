/* eslint-disable @next/next/no-server-import-in-page */

import { getResearcherEmailByProtocolId } from '@repositories/protocol'
import { findUserById } from '@repositories/user'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
    const { subject, message, html, protocolId, toId } = await request.json()

    let toEmail: string

    if (toId) {
        toEmail = (await findUserById(toId).then((res) => {
            return res?.email
        })) as string
    } else {
        toEmail = (await getResearcherEmailByProtocolId(protocolId).then(
            (res) => {
                return res?.researcher.email
            }
        )) as string
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_ADDRESS,
        port: Number(process.env.SMTP_PORT),
    })

    const emailObject = {
        from: 'no-reply@uap.edu.ar',
        to: toEmail,
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
