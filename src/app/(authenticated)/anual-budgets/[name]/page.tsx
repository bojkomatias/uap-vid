import React from 'react'
import { canAccess } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import AnualBudgetTable from 'modules/anual-budget/budget-table'
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
            <AnualBudgetTable
                anualBudgets={anualBudgets}
                totalRecords={totalRecords}
            />
        </>
    )
}
