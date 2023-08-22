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

    const dummydata = [
        {
            id: 1,
            name: 'Categoría 1',
            price: [
                { from: '2020', to: '2021', price: 200.5, currency: 'ARS' },
                { from: '2021', to: '2022', price: 320.5, currency: 'ARS' },
                { from: '2022', to: '2023', price: 500.5, currency: 'ARS' },
            ],
        },
        {
            id: 2,
            name: 'Categoría 2',
            price: [
                { from: '2020', to: '2021', price: 200.5, currency: 'USD' },
                { from: '2021', to: '2022', price: 320.5, currency: 'ARS' },
                { from: '2022', to: '2023', price: 500.5, currency: 'ARS' },
            ],
        },
        {
            id: 3,
            name: 'Categoría 3',
            price: [
                { from: '2020', to: '2021', price: 200.5, currency: 'ARS' },
                { from: '2021', to: '2022', price: 320.5, currency: 'USD' },
                { from: '2022', to: '2023', price: 500.5, currency: 'USD' },
            ],
        },
    ]

    if (!session) return
    if (!canAccess('USERS', session.user.role)) redirect('/protocols')
    return (
        <>
            <pre>{JSON.stringify(categories)}</pre>

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
