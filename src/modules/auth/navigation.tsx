import type { ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import { cx } from '@utils/cx'
import { redirect } from 'next/navigation'
import { DesktopNavigation } from './elements/sidebar'
import { CurrentConvocatory } from '@convocatory/timer'
import { getCurrentConvocatory } from '@repositories/convocatory'
import { authOptions } from 'app/api/auth/[...nextauth]/route'

export default async function Navigation({
    children,
}: {
    children: ReactNode
}) {
    const session = await getServerSession(authOptions)
    if (!session) return redirect('/')

    const currentConvocatory = await getCurrentConvocatory()

    const hasNavigation = session?.user?.role === 'ADMIN'
    return (
        <>
            {hasNavigation ? <DesktopNavigation user={session.user} /> : null}
            {currentConvocatory ? (
                <CurrentConvocatory convocatory={currentConvocatory} />
            ) : null}
            <div
                className={cx(
                    'flex flex-1 flex-col',
                    hasNavigation && 'lg:pl-16'
                )}
            >
                <main className="mx-auto w-full max-w-[100rem] flex-1 px-4 pb-20 sm:px-6 2xl:px-10">
                    {children}
                </main>
            </div>
        </>
    )
}
