'use client'
import { notifications } from '@elements/notifications'
import { useForm } from '@mantine/form'
import { updateAnualBudgetTeamMemberHours } from '@repositories/anual-budget'
import {
  ExecutionType,
  type AnualBudgetTeamMemberWithAllRelations,
  calculateHourRateGivenTMCategory,
  calculateHourRateGivenCategory,
} from '@utils/anual-budget'
import { cx } from '@utils/cx'
import BudgetExecutionView from './execution/budget-execution-view'
import { useRouter } from 'next/navigation'
import type { WEEKS_IN_HALF_YEAR, WEEKS_IN_YEAR } from '@utils/constants'
import type { AmountIndex } from '@prisma/client'
import { Currency } from '@shared/currency'
import {
  multiplyAmountIndex,
  sumAmountIndex,
  ZeroAmountIndex,
} from '@utils/amountIndex'
import { Button } from '@components/button'
import { Heading, Subheading } from '@components/heading'
import { FormInput } from '@shared/form/form-input'
import { Badge } from '@components/badge'
import { Text } from '@components/text'

export function BudgetTeamMemberFees({
  editable,
  budgetTeamMembers,
  ABTe,
  ABTr,
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
    <div className="overflow-auto">
      <form
        className="min-w-[900px] overflow-x-auto rounded-lg border p-4 dark:border-gray-800 print:border-none"
        onSubmit={form.onSubmit(async (values) => {
          if (!editable) return

          const res = await updateAnualBudgetTeamMemberHours(
            Object.values(values).map((e) => {
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
        <div className="flex items-center">
          <div className="flex w-full items-center justify-between">
            <Heading>Honorarios</Heading>
            {editable && (
              <Button
                type="submit"
                outline
                disabled={!form.isDirty()}
                className="float-right px-2 py-1.5 text-xs print:hidden"
              >
                Guardar valores actualizados
              </Button>
            )}
          </div>
        </div>

        <div className="-mx-4 mt-8 flow-root sm:mx-0">
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

            <thead className=" border-b text-gray-700 dark:border-gray-700">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-0"
                >
                  <Subheading>Miembro</Subheading>
                </th>
                <th
                  scope="col"
                  className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-700"
                >
                  <Subheading>Horas anuales</Subheading>
                </th>
                <th
                  scope="col"
                  className={cx(
                    'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700',
                    !editable && 'sm:table-cell'
                  )}
                >
                  <Subheading>Horas restantes</Subheading>
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700 sm:table-cell"
                >
                  <Subheading>Valor hora</Subheading>
                </th>
                <th
                  scope="col"
                  className={cx(
                    'hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-700',
                    !editable && 'sm:table-cell'
                  )}
                >
                  <Subheading>Restante</Subheading>
                </th>
                <th
                  scope="col"
                  className="table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-700"
                >
                  <Subheading>Total</Subheading>
                </th>
                <th
                  scope="col"
                  className={cx(
                    'hidden py-3.5 pr-3 text-right text-sm font-semibold text-gray-700 sm:pr-0 print:hidden',
                    !editable && 'table-cell'
                  )}
                >
                  <Subheading>Ejecuciones</Subheading>
                </th>
              </tr>
            </thead>

            <tbody>
              {budgetTeamMembers.map(
                (
                  {
                    teamMemberId,
                    teamMember,
                    id: anualBudgetTeamMemberId,
                    executions,
                    memberRole,
                    hours,
                    remainingHours,
                    categoryId,
                    category,
                  },
                  i
                ) => (
                  <tr
                    className="border-b dark:border-gray-800"
                    key={teamMemberId ?? categoryId}
                  >
                    <td className="max-w-0 py-2 pl-4 pr-3 text-sm sm:pl-0 print:py-0">
                      <Subheading>
                        {teamMember ? teamMember.name : 'A definir'}
                      </Subheading>
                      <div className="mt-1.5 flex flex-col gap-1 truncate text-gray-500">
                        <div className="flex gap-2">
                          <Badge>Rol: </Badge>
                          <Text>{memberRole}</Text>
                        </div>

                        <div className="flex gap-2">
                          <Badge>Categoría: </Badge>
                          <Text>
                            {teamMemberId ?
                              teamMember?.categories.at(-1)?.category.name
                            : category?.name}
                          </Text>
                          <div>
                            {(
                              teamMemberId &&
                              teamMember?.categories.at(-1)?.pointsObrero
                            ) ?
                              <Text className="text-gray-600">
                                {'[ '}
                                {teamMember.categories.at(-1)?.pointsObrero}
                                {' ]'}
                              </Text>
                            : null}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell px-3 py-5 text-right text-sm text-gray-600">
                      {!editable ?
                        <Text>{hours}</Text>
                      : <FormInput
                          type="number"
                          {...form.getInputProps(`${i}.hours`)}
                          className={cx(
                            form.isDirty(`${i}.hours`) && '!border-yellow-200',
                            'float-right w-20'
                          )}
                          placeholder={form.getInputProps(`${i}.hours`).value}
                        />
                      }
                    </td>
                    <td
                      className={cx(
                        'hidden px-3 py-5 text-right text-sm text-gray-600',
                        !editable && 'sm:table-cell'
                      )}
                    >
                      <Text>{remainingHours.toFixed(2)}</Text>
                    </td>
                    <td className="hidden px-3 py-5 text-right text-sm text-gray-600 sm:table-cell">
                      <Currency
                        amountIndex={
                          teamMemberId ?
                            calculateHourRateGivenTMCategory(
                              teamMember?.categories.at(-1) ?? null
                            )
                          : calculateHourRateGivenCategory(category)
                        }
                      />
                    </td>
                    <td
                      className={cx(
                        'hidden px-3 py-5 text-right text-sm text-gray-600',
                        !editable && 'sm:table-cell'
                      )}
                    >
                      <Currency
                        amountIndex={multiplyAmountIndex(
                          teamMemberId ?
                            calculateHourRateGivenTMCategory(
                              teamMember?.categories.at(-1) ?? null
                            )
                          : calculateHourRateGivenCategory(category),
                          remainingHours
                        )}
                      />
                    </td>
                    <td className="px-3 py-5 text-right text-sm text-gray-600 ">
                      <Currency
                        amountIndex={multiplyAmountIndex(
                          teamMemberId ?
                            calculateHourRateGivenTMCategory(
                              teamMember?.categories.at(-1) ?? null
                            )
                          : calculateHourRateGivenCategory(category),
                          hours
                        )}
                      />
                    </td>
                    {/* Cannot create execution when is pending or have pending team member */}
                    <td
                      className={cx(
                        'hidden text-right print:hidden',
                        !editable && !categoryId && 'table-cell'
                      )}
                    >
                      <BudgetExecutionView
                        positionIndex={i}
                        remaining={multiplyAmountIndex(
                          teamMemberId ?
                            calculateHourRateGivenTMCategory(
                              teamMember?.categories.at(-1) ?? null
                            )
                          : calculateHourRateGivenCategory(category),
                          remainingHours
                        )}
                        executions={executions}
                        anualBudgetTeamMemberId={anualBudgetTeamMemberId}
                        title={teamMember?.name ?? 'A definir'}
                        executionType={ExecutionType.TeamMember}
                        itemName={
                          teamMember!.categories.at(-1)?.category.name ??
                          'Sin categoría'
                        }
                        obrero={
                          teamMember!.categories.at(-1)?.pointsObrero ?
                            {
                              pointsObrero:
                                teamMember!.categories.at(-1)?.pointsObrero ??
                                0,
                              pointPrice:
                                teamMember!.categories.at(-1)?.category
                                  .amountIndex ?? ZeroAmountIndex,
                              hourlyRate:
                                teamMemberId ?
                                  calculateHourRateGivenTMCategory(
                                    teamMember?.categories.at(-1) ?? null
                                  )
                                : calculateHourRateGivenCategory(category),
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
                  className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:table-cell sm:pl-0 sm:text-right "
                >
                  <Text>Ejecutado</Text>
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
                  <Text>Restante</Text>
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
                  <Subheading>Total</Subheading>
                </th>

                <td className="px-3 pt-4 text-sm font-semibold text-gray-700 lg:text-right">
                  <Currency amountIndex={sumAmountIndex([ABTr, ABTe])} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </form>
    </div>
  )
}
