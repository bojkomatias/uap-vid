// import { PageHeading } from '@layout/page-heading'
// import { getAnualBudgetById } from '@repositories/anual-budget'
// import AnualBudgetForm from 'modules/anual-budget/anual-budget-form'
// import { redirect } from 'next/navigation'

// export default async function Page({ params }: { params: { id: string } }) {
//     const ProtocolAnualBudget = await getAnualBudgetById(params.id)
//     if (!ProtocolAnualBudget) redirect('/anual-budgets')
//     return (
//         <>
//             <PageHeading title={'Presupuesto anual'} />
//             <AnualBudgetForm protocolBudget={ProtocolAnualBudget} />
//         </>
//     )
// }
