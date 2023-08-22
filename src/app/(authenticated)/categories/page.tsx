import { PageHeading } from '@layout/page-heading'
import React from 'react'
import { canAccess } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { cx } from '@utils/cx'
import { buttonStyle } from '@elements/button/styles'
import Link from 'next/link'

export default async function Page() {
    const session = await getServerSession(authOptions)

    if (!session) return
    if (!canAccess('USERS', session.user.role)) redirect('/protocols')
    return (
        <section className="flex flex-col gap-2">
            <PageHeading title="Categorías de miembros de equipo de investigación" />
            <p className="ml-2 text-sm text-gray-500">
                Lista de las categorías asignables a los miembros de equipo de
                un proyecto de investigación.
            </p>
            <Link
                href={'/categories/new'}
                className={cx(buttonStyle('secondary'), 'w-fit')}
            >
                Crear categoría
            </Link>
        </section>
    )
}
