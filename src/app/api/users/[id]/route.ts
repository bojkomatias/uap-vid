// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { updateUserById } from '@repositories/users'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const { role } = await request.json()

    if (!id || !role) {
        return new Response('We cannot update your user: Invalid Data', {
            status: 500,
        })
    }

    const updated = await updateUserById(id as string, { role })

    if (!updated) {
        return new Response('We cannot update your user', { status: 500 })
    }

    return NextResponse.json({ message: 'success' })
}
