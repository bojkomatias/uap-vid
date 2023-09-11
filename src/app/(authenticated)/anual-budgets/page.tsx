import { PageHeading } from '@layout/page-heading'
import React from 'react'
import { canAccess } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

import Link from 'next/link'
import AnualBudgetTable from 'modules/anual-budget/anual-budget-table'

import { getAnualBudgets } from '@repositories/anual-budget'

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session || !canAccess('MEMBER_CATEGORIES', session.user.role))
        redirect('/protocols')

    const [totalRecords, anualBudgets] = await getAnualBudgets(searchParams)

    return (
        <>
            <PageHeading title="Presupuestos anuales" />
            <p className="ml-2 text-sm text-gray-500">
                Lista de los presupuestos anuales de los distintos proyectos de
                investigación{' '}
                <Link
                    className="transition hover:underline"
                    href="/protocols?page=1&filter=state&values=ACCEPTED"
                >
                    aceptados
                </Link>
                .
            </p>
            <AnualBudgetTable
                anualBudgets={anualBudgets}
                totalRecords={totalRecords}
            />
        </>
    )
}
