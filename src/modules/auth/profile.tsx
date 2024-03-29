'use client'
import type { User } from '@prisma/client'

export default function Profile({ user }: { user: User }) {
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
