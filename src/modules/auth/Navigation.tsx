import { ReactNode } from 'react'
import { Session } from 'next-auth'
import MobileNavigation from './elements/MobileBar'
import Sidebar from './elements/Sidebar'
import clsx from 'clsx'
import { redirect } from 'next/navigation'

export default function Navigation({
    session,
    children,
}: {
    session: Session
    children: ReactNode
}) {
    if (!session) redirect('/')
    const hasNavigation =
        session?.user?.role === 'ADMIN' || session?.user?.role === 'SECRETARY'
    return (
        <>
            {hasNavigation ? (
                <div className="absolute inset-0">
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
                <main className="relative mx-auto w-full max-w-[100rem] flex-1 px-4 pb-20 sm:px-6 2xl:px-10">
                    {children}
                </main>
            </div>
        </>
    )
}
