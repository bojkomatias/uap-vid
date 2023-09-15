import Currency from '@elements/currency'
import type { AnualBudgetItem } from '@prisma/client'
import type {
    AnualBudgetTeamMemberWithAllRelations,
    TotalBudgetCalculation,
} from '@utils/anual-budget'
import { currencyFormatter } from '@utils/formatters'
import { TeamMemberFees } from './team-member-fees'

export function BudgetView({
    approved,
    budgetItems,
    budgetTeamMembers,
    calculations,
}: {
    approved: boolean
    budgetItems: AnualBudgetItem[]
    budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
    calculations: TotalBudgetCalculation
}) {
    return (
        <div
            // onSubmit={form.onSubmit((values) => console.log(values))}
            className="mx-auto mt-10 max-w-7xl space-y-6"
        >
            <TeamMemberFees
            approved={approved}
                budgetTeamMembers={budgetTeamMembers}
                ABTe={calculations.ABTe}
                ABTr={calculations.ABTr}
            />

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
