import { calculateTotalBudget } from '@utils/anual-budget'
import { currencyFormatter } from '@utils/formatters'
import { getAnualBudgetById } from '@repositories/anual-budget'
import { PDF } from 'modules/budget-pdf'

export async function BudgetResearcherView({ budgetId }: { budgetId: string }) {
    const anualBudget = await getAnualBudgetById(budgetId)
    if (!anualBudget) return

    const { budgetItems, budgetTeamMembers } = anualBudget

    const calculations = calculateTotalBudget(anualBudget)

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold leading-7 text-gray-900">
                    Presupuesto anual {anualBudget.year}
                </h1>
                <PDF
                    budgetItems={budgetItems}
                    budgetTeamMembers={budgetTeamMembers}
                    year={anualBudget.year}
                    protocolTitle={
                        anualBudget.protocol.sections.identification.title
                    }
                    calculations={calculations}
                />
            </div>
            <div>
                <h2 className="text-base font-semibold leading-6 text-gray-800">
                    Honorarios
                </h2>
                <div className="-mx-4 mt-3 flow-root sm:mx-0">
                    <table className="min-w-full">
                        <colgroup>
                            <col className="w-[38%]" />
                            <col className="w-[20%]" />
                            <col className="w-[20%]" />
                            <col className="w-[20%]" />
                        </colgroup>
                        <thead className="border-b border-gray-300 text-gray-900">
                            <tr>
                                <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                >
                                    Miembro
                                </th>
                                <th
                                    scope="col"
                                    className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                                >
                                    Horas
                                </th>
                                <th
                                    scope="col"
                                    className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                                >
                                    Valor / hora
                                </th>

                                <th
                                    scope="col"
                                    className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                                >
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgetTeamMembers.map(
                                ({
                                    teamMember: { id, name, categories },

                                    hours,
                                }) => (
                                    <tr
                                        key={id}
                                        className="border-b border-gray-200"
                                    >
                                        <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                                            <div className="font-medium text-gray-900">
                                                {name}
                                            </div>
                                        </td>

                                        <td className="hidden px-3 py-5 text-right text-sm text-gray-600 sm:table-cell">
                                            {hours}
                                        </td>
                                        <td className="hidden px-3 py-5 text-right text-sm text-gray-600 sm:table-cell">
                                            $
                                            {currencyFormatter.format(
                                                categories
                                                    .at(-1)
                                                    ?.category.price.at(-1)
                                                    ?.price ?? 0
                                            )}
                                        </td>

                                        <td className="px-3 py-5 text-right text-sm text-gray-600 ">
                                            $
                                            {currencyFormatter.format(
                                                (categories
                                                    .at(-1)
                                                    ?.category.price.at(-1)
                                                    ?.price ?? 0) * hours
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th
                                    scope="row"
                                    colSpan={3}
                                    className="pl-4 pr-3 pt-6 text-left text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0 sm:text-right"
                                >
                                    Subtotal
                                </th>

                                <td className="px-3 pt-4 text-right text-sm font-semibold text-gray-900">
                                    $
                                    {currencyFormatter.format(
                                        calculations.ABTr + calculations.ABTe
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            {budgetItems.length > 0 && (
                <div>
                    <h2 className="text-base font-semibold leading-6 text-gray-800">
                        Lista de gastos directos
                    </h2>
                    <div className="-mx-4 mt-3 flow-root sm:mx-0">
                        <table className="min-w-full">
                            <colgroup>
                                <col className="w-[80%]" />
                                <col className="w-[20%]" />
                            </colgroup>
                            <thead className="border-b border-gray-300 text-gray-900">
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Detalle
                                    </th>

                                    <th
                                        scope="col"
                                        className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                                    >
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgetItems.map(({ detail, amount }, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-gray-200 text-gray-600"
                                    >
                                        <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                                            <div className="font-medium text-gray-900">
                                                {detail}
                                            </div>
                                        </td>

                                        <td className="table-cell px-3 py-5 text-right text-sm">
                                            ${currencyFormatter.format(amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <th
                                        scope="row"
                                        className="table-cell pl-4 pt-4 text-left text-sm font-semibold text-gray-900 sm:text-right"
                                    >
                                        Subtotal
                                    </th>
                                    <td className="px-3 pt-4 text-right text-sm font-semibold text-gray-900">
                                        $
                                        {currencyFormatter.format(
                                            calculations.ABIr +
                                                calculations.ABIe
                                        )}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            <div className="flex justify-between text-lg font-medium">
                <span>Total de presupuesto:</span>
                <span className="font-semibold">
                    ARS ${currencyFormatter.format(calculations.total)}
                </span>
            </div>
        </div>
    )
}
