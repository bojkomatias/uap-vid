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
                <div className="absolute inset-y-0">
                    <MobileNavigation user={session?.user!} />
                    <Sidebar user={session?.user!} />
                </div>
            ) : null}
            <div
                className={clsx(
                    'flex flex-1 flex-col',
                    hasNavigation ? 'lg:pl-64' : ''
                )}
            >
                <main className="relative mx-auto min-h-[90vh] w-full max-w-[120rem] flex-1 px-4 pb-20 sm:px-6 2xl:px-24">
                    {children}
                </main>
            </div>
        </>
    )
}
