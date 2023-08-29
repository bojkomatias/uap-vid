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
    if (!session || !canAccess('MEMBER_CATEGORIES', session.user.role))
        redirect('/protocols')

    const [totalRecords, categories] = await getCategories(searchParams)

    return (
        <>
            <PageHeading title="Presupuestos anuales" />
            <p className="ml-2 text-sm text-gray-500">
                Lista de los presupuestos anuales de los distintos proyectos de
                investigación{' '}
                <Link
                    className="transition hover:underline"
                    href="/protocols?page=1&filter=state&values=ON_GOING"
                >
                    en curso
                </Link>
                .
            </p>

            <CategoriesTable
                categories={categories}
                totalRecords={totalRecords}
            />
        </>
    )
}
