import { PageHeading } from '@layout/page-heading'
import React from 'react'
import { canAccess } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { cx } from '@utils/cx'
import { buttonStyle } from '@elements/button/styles'
import Link from 'next/link'
import CategoriesTable from 'modules/categories/team-member-category-table'
import { getCategories } from '@repositories/team-member-category'

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string }
}) {
    const session = await getServerSession(authOptions)

    const [totalRecords, categories] = await getCategories(searchParams)

    if (!session) return
    if (!canAccess('USERS', session.user.role)) redirect('/protocols')
    console.log(categories)
    return (
        <>
            <div className="w-[80vw]">{JSON.stringify(categories)}</div>

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
            <CategoriesTable
                categories={categories}
                totalRecords={totalRecords}
            />
        </>
    )
}
