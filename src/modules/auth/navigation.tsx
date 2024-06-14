import type { ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import { cx } from '@utils/cx'
import { redirect } from 'next/navigation'
import { AppSidebar, DesktopNavigation } from './elements/app-sidebar'
import { CurrentConvocatory } from '@convocatory/timer'
import { getCurrentConvocatory } from '@repositories/convocatory'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { SidebarLayout } from '@components/sidebar-layout'

export default async function Navigation({
    children,
}: {
    children: ReactNode
}) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/')

    const currentConvocatory = await getCurrentConvocatory()

    const hasNavigation = session?.user?.role === 'ADMIN'

    return (
        <>
            {hasNavigation ? <DesktopNavigation user={session.user} /> : null}
            {currentConvocatory ? (
                <CurrentConvocatory convocatory={currentConvocatory} />
            ) : null}
            <div
                className={cx('flex flex-1 flex-col', hasNavigation && 'pl-16')}
            >
                <main className="w-full flex-1 px-4 pb-20 sm:px-6 xl:px-10">
                    {children}
                </main>
            </div>
        </>
    )
}

export async function AppLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/')

    const convocatory = await getCurrentConvocatory()

    return (
        <SidebarLayout
            sidebar={
                <AppSidebar user={session.user} convocatory={convocatory} />
            }
            navbar={'PUTOS'}
        >
            {children}
        </SidebarLayout>
    )
}
