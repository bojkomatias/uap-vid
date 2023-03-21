import { ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import MobileNavigation from './elements/MobileBar'
import Sidebar from './elements/Sidebar'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import clsx from 'clsx'

export default async function Navigation({
    children,
}: {
    children: ReactNode
}) {
    const session = await getServerSession(authOptions)
    const hasNavigation =
        session?.user?.role === 'ADMIN' || session?.user?.role === 'SECRETARY'
    return (
        <>
            {hasNavigation ? (
                <>
                    <MobileNavigation user={session?.user!} />
                    <Sidebar user={session?.user!} />
                </>
            ) : null}
            <div
                className={clsx(
                    'flex flex-1 flex-col',
                    hasNavigation ? 'lg:pl-64' : ''
                )}
            >
                <main className="flex-1 pb-20 px-4 sm:px-6 relative">
                    {children}
                </main>
            </div>
        </>
    )
}
