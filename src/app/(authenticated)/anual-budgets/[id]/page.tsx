import { PageHeading } from '@layout/page-heading'
import type { AnualBudget } from '@prisma/client'
import AnualBudgetForm from 'modules/anual-budget/anual-budget-form'

export default function Page() {
    const ProtocolAnualBudget: AnualBudget = {
        id: 'blah bla',
        protocolId: '12394',
        updatedAt: new Date(),
        createdAt: new Date(),
        year: 2039,
        budgetItems: [
            {
                type: 'Viajes',
                amount: 2041.2,
                detail: 'Me fui cancun',
                executions: [],
            },
        ],
        budgetTeamMembers: [
            {
                teamMemberId: 'sape',
                hours: 20,
                remainingHours: 10,
                executions: [],
            },
        ],
    }
    return (
        <>
            <PageHeading title={'Presupuesto anual'} />
            <AnualBudgetForm protocolBudget={ProtocolAnualBudget} />
        </>
    )
}
