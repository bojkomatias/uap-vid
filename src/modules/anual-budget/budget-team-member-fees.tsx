'use client'
import { Button } from '@elements/button'
import { notifications } from '@elements/notifications'
import { useForm } from '@mantine/form'
import { updateAnualBudgetTeamMemberHours } from '@repositories/anual-budget'
import {
  ExecutionType,
  type AnualBudgetTeamMemberWithAllRelations,
  calculateHourRateGivenCategory,
} from '@utils/anual-budget'
import { cx } from '@utils/cx'
import BudgetExecutionView from './execution/budget-execution-view'
import { useRouter } from 'next/navigation'
import type { WEEKS_IN_HALF_YEAR, WEEKS_IN_YEAR } from '@utils/constants'
import type { AmountIndex } from '@prisma/client'
import { Currency } from '@shared/currency'
import { multiplyAmountIndex, sumAmountIndex, ZeroAmountIndex } from '@utils/amountIndex'

export function BudgetTeamMemberFees({
  editable,
  budgetTeamMembers,
  ABTe,
  ABTr,
  duration,
}: {
  editable: boolean
  budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
  ABTe: AmountIndex
  ABTr: AmountIndex
  duration: typeof WEEKS_IN_YEAR | typeof WEEKS_IN_HALF_YEAR
}) {
  const router = useRouter()
  const form = useForm({ initialValues: budgetTeamMembers })
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        if (!editable) return

        const res = await updateAnualBudgetTeamMemberHours(
          values.map((e) => {
            return {
              id: e.id,
              hours: e.hours,
              remainingHours: e.hours,
            }
          })
        )
        if (res) {
          notifications.show({
            title: 'Valores actualizados',
            message:
              'Las horas de los miembros de equipo fueron actualizadas con éxito',
            intent: 'success',
          })
          router.refresh()
        }
      })}
    >
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-700">
            Honorarios
          </h1>
        </div>
      </div>

      <div className="-mx-4 mt-8 flow-root sm:mx-0">
        {editable ?
          <Button
            type="submit"
            intent="secondary"
            disabled={!form.isDirty()}
            className="float-right px-2 py-1.5 text-xs"
          >
            Guardar valores actualizados
          </Button>
        : null}
        <table className="min-w-full">
          <colgroup>
            <col className={cx(!editable ? ' w-[30%]' : ' w-[38%]')} />
            <col className={!editable ? 'w-[12%]' : 'w-[20%]'} />
            <col className={!editable ? 'w-[12%]' : 'w-[20%]'} />
            <col className={!editable ? 'w-[12%]' : 'w-[20%]'} />
            <col className={!editable ? 'w-[12%]' : 'hidden'} />
            <col className={!editable ? 'w-[12%]' : 'hidden'} />
            <col className={!editable ? 'w-[10%]' : 'hidden'} />
          </colgroup>
          <thead className="border-b border-gray-300 text-gray-700">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-0"
              >
                Miembro
              </th>
              <th
                scope="col"
                className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-700"
              >
                Horas anuales
              </th>
              <th
                scope="col"
                className={cx(
                  'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700',
                  !editable && 'sm:table-cell'
                )}
              >
                Horas restantes
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700 sm:table-cell"
              >
                Valor hora
              </th>
              <th
                scope="col"
                className={cx(
                  'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700',
                  !editable && 'sm:table-cell'
                )}
              >
                Restante
              </th>
              <th
                scope="col"
                className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-700"
              >
                Total
              </th>
              <th
                scope="col"
                className={cx(
                  'hidden py-3.5 pr-3 text-right text-sm font-semibold text-gray-700 sm:pr-0',
                  !editable && 'table-cell'
                )}
              >
                Ejecuciones
              </th>
            </tr>
          </thead>
          <tbody>
            {budgetTeamMembers.map(
              (
                {
                  teamMember: { id, name, categories },
                  id: anualBudgetTeamMemberId,
                  executions,
                  memberRole,
                  hours,
                  remainingHours,
                },
                i
              ) => (
                <tr key={id} className="border-b border-gray-200">
                  <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div className="font-medium text-gray-700">{name}</div>
                    <div className="mt-1 truncate text-gray-500">
                      <b>Rol: </b>
                      {memberRole}
                      {' - '}
                      <b>Categoría: </b>
                      <span className="font-medium text-gray-700">
                        {categories.at(-1)?.category.name}
                      </span>{' '}
                      <span>
                        {categories.at(-1)?.pointsObrero ?
                          <span className="text-gray-600">
                            {'['}
                            {categories.at(-1)?.pointsObrero}
                            {']'}
                          </span>
                        : null}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell px-3 py-5 text-right text-sm text-gray-600">
                    {!editable ?
                      hours
                    : <input
                        type="number"
                        defaultValue={form.getInputProps(`${i}.hours`).value}
                        onBlur={(e) =>
                          form.setFieldValue(
                            `${i}.hours`,
                            Number(e.target.value)
                          )
                        }
                        className={cx(
                          'input w-16 text-right text-xs',
                          form.isDirty(`${i}.hours`) &&
                            'border-yellow-200 bg-yellow-50'
                        )}
                        placeholder="24"
                      />
                    }
                  </td>
                  <td
                    className={cx(
                      'hidden px-3 py-5 text-right text-sm text-gray-600',
                      !editable && 'sm:table-cell'
                    )}
                  >
                    {remainingHours.toFixed(2)}
                  </td>
                  <td className="hidden px-3 py-5 text-right text-sm text-gray-600 sm:table-cell">
                    <Currency amountIndex={calculateHourRateGivenCategory(categories.at(-1) ?? null)} />
                  </td>
                  <td
                    className={cx(
                      'hidden px-3 py-5 text-right text-sm text-gray-600',
                      !editable && 'sm:table-cell'
                    )}
                  >
                    <Currency amountIndex={multiplyAmountIndex(calculateHourRateGivenCategory(categories.at(-1) ?? null), remainingHours
                    )}/>
                    
                      
                  </td>
                  <td className="px-3 py-5 text-right text-sm text-gray-600 ">
                    <Currency amountIndex={multiplyAmountIndex(calculateHourRateGivenCategory(categories.at(-1)??null) , hours)} />
                  </td>
                  <td className={cx('hidden', !editable && 'table-cell')}>
                    <BudgetExecutionView
                      positionIndex={i}
                      remaining={
                        multiplyAmountIndex(
                        calculateHourRateGivenCategory(
                          categories.at(-1) ?? null
                        ), remainingHours)
                      }
                      executions={executions}
                      anualBudgetTeamMemberId={anualBudgetTeamMemberId}
                      title={name}
                      executionType={ExecutionType.TeamMember}
                      itemName={
                        categories.at(-1)?.category.name ?? 'Sin Categoría'
                      }
                      obrero={
                        categories.at(-1)?.pointsObrero ?
                          {
                            pointsObrero: categories.at(-1)?.pointsObrero ?? 0,
                            pointPrice:
                              categories.at(-1)?.category.amountIndex ??
                              ZeroAmountIndex,
                            hourlyRate: calculateHourRateGivenCategory(
                              categories.at(-1) ?? null
                            ),
                          }
                        : undefined
                      }
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
          <tfoot>
            <tr>
              <th
                scope="row"
                colSpan={!editable ? 5 : 3}
                className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0 sm:text-right"
              >
                Ejecutado
              </th>
              <td className="px-3 pt-6 text-right text-sm text-gray-500">
                {!editable ?
                  <Currency amountIndex={ABTe} />
                : '-'}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={!editable ? 5 : 3}
                className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0 sm:text-right"
              >
                Restante
              </th>
              <td className="px-3 pt-4 text-right text-sm text-gray-500">
                <Currency amountIndex={ABTr} />
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={!editable ? 5 : 3}
                className="pl-4 pr-3 pt-6 text-left text-sm font-semibold text-gray-700 sm:table-cell sm:pl-0 sm:text-right"
              >
                Total
              </th>

              <td className="px-3 pt-4 text-right text-sm font-semibold text-gray-700">
                <Currency amountIndex={sumAmountIndex([ABTr,ABTe])} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </form>
  )
}
