'use client'

import { user } from '@prisma/client'
import { useSession } from 'next-auth/react'

export default function Profile({ user }: { user: user }) {
    return (
        <div className="space-y-6 p-20">
            <div className="space-x-3 text-3xl">
                <span>Email:</span>
                <span className="font-light italic text-primary">
                    {user?.email}
                </span>
            </div>
            <div className="space-x-3 text-xl">
                <span>Role:</span>
                <span className="font-light italic text-primary">
                    {user?.role}
                </span>
            </div>
        </div>
    )
}
