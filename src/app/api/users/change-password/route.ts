
import { updateUserPasswordById } from '@repositories/user'
import { createHashScrypt, verifyHashScrypt } from '@utils/hash'
import { NextResponse, type NextRequest } from 'next/server'

export async function PATCH(request: NextRequest) {
    const res = await request.json()

    const id = res.id
    const currentPasswordHash = res.currentPasswordHash
    const currentPassword = res.currentPassword
    const newPassword = res.newPassword

    const passwordCheck = await verifyHashScrypt(
        currentPassword,
        currentPasswordHash
    )

    if (!id || !newPassword) {
        return new Response('We cannot update your user: Invalid Data', {
            status: 500,
        })
    } else if (!passwordCheck) {
        return new Response('Invalid password', {
            status: 500,
        })
    }

    const updated = await updateUserPasswordById(
        id,
        await createHashScrypt(newPassword)
    )

    if (!updated) {
        return new Response('We cannot update your password', { status: 500 })
    }

    return NextResponse.json({ message: 'success', status: 200 })
}
