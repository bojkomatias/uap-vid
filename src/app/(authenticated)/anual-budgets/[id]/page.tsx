import { PageHeading } from '@layout/page-heading'
import type { AnualBudget } from '@prisma/client'
import { getAnualBudgetById } from '@repositories/anual-budget'
import AnualBudgetForm from 'modules/anual-budget/anual-budget-form'

export default async function Page({ params }: { params: { id: string } }) {
    const ProtocolAnualBudget = await getAnualBudgetById(params.id)
    return (
        <>
            <PageHeading title={'Presupuesto anual'} />
            <AnualBudgetForm protocolBudget={ProtocolAnualBudget} />
        </>
    )
}
