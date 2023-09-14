import Currency from '@elements/currency'
import type { AnualBudget, AnualBudgetItem } from '@prisma/client'
import type {
    AnualBudgetTeamMemberWithAllRelations,
    TotalBudgetCalculation,
} from '@utils/anual-budget'

import { currencyFormatter, dateFormatter } from '@utils/formatters'
import { TeamMemberFees } from './team-member-fees'

export default function AnualBudgetView({
    meta,
    budgetItems,
    budgetTeamMembers,
    calculations,
}: {
    meta: Omit<AnualBudget, 'budgetItems'>
    budgetItems: AnualBudgetItem[]
    budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
    calculations: TotalBudgetCalculation
}) {
    return (
        <div
            // onSubmit={form.onSubmit((values) => console.log(values))}
            className="mx-auto mt-10 max-w-7xl space-y-6"
        >
            <div>
                <div>
                    Presupuesto anual{' '}
                    <span className="font-medium">{meta.year}</span> de
                    <span className="ml-1 truncate italic">
                        {/* {protocolBudget.protocol.sections.identification.title} */}
                    </span>
                </div>
                <div className="space-x-6 text-sm font-light">
                    <span>Creado: {dateFormatter.format(meta.createdAt)}</span>
                    <span>
                        Ultima edición: {dateFormatter.format(meta.updatedAt)}
                    </span>
                </div>
            </div>

            <div className="w-full border-t border-gray-200" />

            <TeamMemberFees
                budgetTeamMembers={budgetTeamMembers}
                ABTe={calculations.ABTe}
                ABTr={calculations.ABTr}
            />

            <div className="w-full border-t border-gray-200" />

            <div className="font-medium">Gastos directos</div>
            <div>
                {budgetItems.map(({ type, detail, amount }, i) => (
                    <div key={i} className="grid grid-cols-4 gap-3 space-y-2">
                        <span className="flex flex-col">
                            <label className="label">Tipo</label>
                            <span>{type}</span>
                        </span>
                        <span className="flex flex-col">
                            <label className="label">Detalle</label>
                            <span>{detail}</span>
                        </span>
                        <span className="flex flex-col items-end">
                            <label className="label">Monto solicitado</label>
                        </span>
                        <span className="flex flex-col items-end">
                            <label className="label">Monto restante</label>
                            <span>$ {currencyFormatter.format(amount)}</span>
                        </span>
                    </div>
                ))}
            </div>

            {/* <Button
                intent="secondary"
                type="submit"
                disabled={!form.isDirty()}
                className="float-right"
            >
                Guardar
            </Button> */}
            <div className="mt-8 flex flex-row-reverse">
                <Currency amount={calculations.total} size="md" />
            </div>
        </div>
    )
}
