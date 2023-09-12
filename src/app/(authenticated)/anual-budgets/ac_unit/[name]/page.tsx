import React from 'react'
import { canAccess } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import AnualBudgetTable from 'modules/anual-budget/anual-budget-table'
import {
    getAnualBudgets,
    getAnualBudgetsByAcademicUnit,
} from '@repositories/anual-budget'

export default async function Page({
    params,
    searchParams,
}: {
    params: { name: string }
    searchParams: { [key: string]: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session || !canAccess('MEMBER_CATEGORIES', session.user.role))
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
