import React from 'react'
import { canAccess } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getAnualBudgetsByAcademicUnit } from '@repositories/anual-budget'
import AnualBudgetTable from 'modules/anual-budget/budget-table'

export default async function Page({
    params,
    searchParams,
}: {
    params: { name: string }
    searchParams: { [key: string]: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session || !canAccess('ANUAL_BUDGETS', session.user.role))
        redirect('/protocols')

    const [totalRecords, anualBudgets] = await getAnualBudgetsByAcademicUnit(
        params.name,
        searchParams
    )

    return (
        <>
            <AnualBudgetTable
                anualBudgets={anualBudgets}
                totalRecords={totalRecords}
            />
        </>
    )
}
