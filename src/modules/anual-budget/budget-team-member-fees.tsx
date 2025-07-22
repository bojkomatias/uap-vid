'use client'
import { notifications } from '@elements/notifications'
import { useForm } from '@mantine/form'
import { updateAnualBudgetTeamMemberHours } from '@repositories/anual-budget'
import type { AmountIndex } from '@prisma/client'
import type { ProtocolSectionsIdentificationTeam } from '@prisma/client'
import {
  ExecutionType,
  type AnualBudgetTeamMemberWithAllRelations,
  calculateHourRateGivenTMCategory,
  calculateHourRateGivenCategory,
} from '@utils/anual-budget'
import { cx } from '@utils/cx'
import BudgetExecutionView from './execution/budget-execution-view'
import BudgetNewExecution from './execution/budget-new-execution'
import { useRouter } from 'next/navigation'
import type { WEEKS_IN_HALF_YEAR, WEEKS_IN_YEAR } from '@utils/constants'
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
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from '@components/dialog'
import { useState } from 'react'
import { InfoCircle } from 'tabler-icons-react'

export function BudgetTeamMemberFees({
  editable,
  budgetTeamMembers,
  ABTe,
  ABTr,
  protocolTeam,
}: {
  editable: boolean
  budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
  ABTe: AmountIndex
  ABTr: AmountIndex
  duration: typeof WEEKS_IN_YEAR | typeof WEEKS_IN_HALF_YEAR
  protocolTeam: ProtocolSectionsIdentificationTeam[]
}) {
  const router = useRouter()
  const form = useForm({ initialValues: budgetTeamMembers })
  const [selectedMember, setSelectedMember] =
    useState<AnualBudgetTeamMemberWithAllRelations | null>(null)

  // Helper function to find the deactivation date for a team member
  const findDeactivationDate = (teamMemberId: string | null): Date | null => {
    if (!teamMemberId) return null

    const protocolMember = protocolTeam.find(
      (pm) => pm.teamMemberId === teamMemberId
    )

    if (!protocolMember?.assignments) return null

    // Find assignment with 'to' date (deactivated assignment)
    const deactivatedAssignment = protocolMember.assignments.find((a) => a.to)
    return deactivatedAssignment?.to || null
  }

  // Helper function to calculate executed amount for a team member
  const calculateExecutedAmount = (executions: any[]): AmountIndex => {
    return executions.reduce(
      (acc, execution) => {
        if (!execution?.amountIndex) return acc
        return sumAmountIndex([acc, execution.amountIndex])
      },
      { FCA: 0, FMR: 0 } as AmountIndex
    )
  }

  const openMemberDialog = (member: AnualBudgetTeamMemberWithAllRelations) => {
    setSelectedMember(member)
  }

  const closeMemberDialog = () => {
    setSelectedMember(null)
  }

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
            <div>
              <Heading>Honorarios</Heading>
              <Text className="mt-1 text-sm text-gray-500">
                Haga clic en cualquier fila para ver detalles y gestionar
                ejecuciones
              </Text>
            </div>
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
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <Subheading>Miembro del Equipo</Subheading>
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <Subheading>Horas</Subheading>
                  </th>
                  {!editable && (
                    <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                      <Subheading>Restantes</Subheading>
                    </th>
                  )}
                  {!editable && (
                    <th className="px-3 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                      <Subheading>Ejecutado</Subheading>
                    </th>
                  )}
                  <th className="px-3 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <Subheading>Total Presupuestado</Subheading>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
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
                  ) => {
                    const deactivationDate = findDeactivationDate(teamMemberId)
                    const isDeactivated = !!deactivationDate
                    const member = {
                      teamMemberId,
                      teamMember,
                      id: anualBudgetTeamMemberId,
                      executions,
                      memberRole,
                      hours,
                      remainingHours,
                      categoryId,
                      category,
                      anualBudgetId: budgetTeamMembers[i].anualBudgetId,
                    } as AnualBudgetTeamMemberWithAllRelations

                    return (
                      <tr
                        key={teamMemberId ?? categoryId}
                        onClick={() => openMemberDialog(member)}
                        className={cx(
                          'cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50',
                          isDeactivated && 'bg-red-50/30 dark:bg-red-900/10'
                        )}
                      >
                        {/* Member Info Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Subheading className="text-gray-900 dark:text-gray-100">
                              {teamMember ? teamMember.name : 'A definir'}
                            </Subheading>
                            {isDeactivated && (
                              <Badge
                                color="red"
                                className="whitespace-nowrap text-xs"
                              >
                                Finalizado{' '}
                                {deactivationDate.toLocaleDateString('es-ES')}
                              </Badge>
                            )}
                          </div>
                        </td>

                        {/* Hours Column */}
                        <td className="px-3 py-4 text-center">
                          {!editable ?
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {hours.toFixed(1)}
                            </div>
                          : <FormInput
                              type="number"
                              {...form.getInputProps(`${i}.hours`)}
                              className={cx(
                                form.isDirty(`${i}.hours`) &&
                                  '!border-yellow-200',
                                'mx-auto w-20 text-center font-semibold'
                              )}
                              placeholder={
                                form.getInputProps(`${i}.hours`).value
                              }
                            />
                          }
                          <div className="mt-1 text-xs text-gray-500">
                            <Currency
                              defaultFCA={
                                !Boolean(
                                  teamMember?.categories.at(-1)?.pointsObrero
                                )
                              }
                              amountIndex={
                                teamMemberId ?
                                  calculateHourRateGivenTMCategory(
                                    teamMember?.categories.at(-1) ?? null
                                  )
                                : calculateHourRateGivenCategory(category)
                              }
                            />
                            /hora
                          </div>
                        </td>

                        {/* Remaining Hours Column (only in view mode) */}
                        {!editable && (
                          <td className="px-3 py-4 text-center">
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {remainingHours.toFixed(1)}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              <Currency
                                defaultFCA={
                                  !Boolean(
                                    teamMember?.categories.at(-1)?.pointsObrero
                                  )
                                }
                                amountIndex={multiplyAmountIndex(
                                  teamMemberId ?
                                    calculateHourRateGivenTMCategory(
                                      teamMember?.categories.at(-1) ?? null
                                    )
                                  : calculateHourRateGivenCategory(category),
                                  remainingHours
                                )}
                              />
                            </div>
                          </td>
                        )}

                        {/* Executed Amount Column (only in view mode) */}
                        {!editable && (
                          <td className="px-3 py-4 text-right">
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              <Currency
                                defaultFCA={
                                  !Boolean(
                                    teamMember?.categories.at(-1)?.pointsObrero
                                  )
                                }
                                amountIndex={calculateExecutedAmount(
                                  executions
                                )}
                              />
                            </div>
                          </td>
                        )}

                        {/* Total Column */}
                        <td className="px-3 py-4 text-right">
                          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                            <Currency
                              defaultFCA={
                                !Boolean(
                                  teamMember?.categories.at(-1)?.pointsObrero
                                )
                              }
                              amountIndex={multiplyAmountIndex(
                                teamMemberId ?
                                  calculateHourRateGivenTMCategory(
                                    teamMember?.categories.at(-1) ?? null
                                  )
                                : calculateHourRateGivenCategory(category),
                                hours
                              )}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="mt-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <Text className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Ejecutado
                </Text>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {!editable ?
                    <Currency amountIndex={ABTe} />
                  : '-'}
                </div>
              </div>
              <div className="text-center">
                <Text className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Restante
                </Text>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  <Currency amountIndex={ABTr} />
                </div>
              </div>
              <div className="text-center">
                <Text className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total
                </Text>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  <Currency amountIndex={sumAmountIndex([ABTr, ABTe])} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Member Details Dialog */}
      {selectedMember && (
        <Dialog open={!!selectedMember} onClose={closeMemberDialog} size="2xl">
          <DialogTitle>
            {selectedMember.teamMember ?
              selectedMember.teamMember.name
            : 'A definir'}
          </DialogTitle>
          <DialogBody>
            <div className="space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Estado
                  </Text>
                  <div>
                    {(() => {
                      const deactivationDate = findDeactivationDate(
                        selectedMember.teamMemberId
                      )
                      return deactivationDate ?
                          <Badge color="red" className="text-xs">
                            Finalizado{' '}
                            {deactivationDate.toLocaleDateString('es-ES')}
                          </Badge>
                        : <Badge color="green" className="text-xs">
                            Activo
                          </Badge>
                    })()}
                  </div>
                </div>
                <div>
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Rol
                  </Text>
                  <Text className="font-medium">
                    {selectedMember.memberRole}
                  </Text>
                </div>
              </div>

              {/* Category Information */}
              <div>
                <Text className="mb-2 text-sm font-medium text-gray-500">
                  Categoría
                </Text>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="font-medium">
                        {selectedMember.teamMemberId ?
                          selectedMember.teamMember?.categories.at(-1)?.category
                            .name
                        : selectedMember.category?.name}
                      </Text>
                      {selectedMember.teamMemberId &&
                        selectedMember.teamMember?.categories.at(-1)
                          ?.pointsObrero && (
                          <Text className="text-sm text-gray-500">
                            Obrero -{' '}
                            {
                              selectedMember.teamMember.categories.at(-1)
                                ?.pointsObrero
                            }{' '}
                            puntos
                          </Text>
                        )}
                    </div>
                    <div className="text-right">
                      <Text className="text-sm text-gray-500">
                        Valor por hora
                      </Text>
                      <Text className="font-semibold">
                        <Currency
                          defaultFCA={
                            !Boolean(
                              selectedMember.teamMember?.categories.at(-1)
                                ?.pointsObrero
                            )
                          }
                          amountIndex={
                            selectedMember.teamMemberId ?
                              calculateHourRateGivenTMCategory(
                                selectedMember.teamMember?.categories.at(-1) ??
                                  null
                              )
                            : calculateHourRateGivenCategory(
                                selectedMember.category
                              )
                          }
                        />
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours and Budget Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Horas Asignadas
                  </Text>
                  <Subheading className="text-2xl">
                    {selectedMember.hours.toFixed(1)}
                  </Subheading>
                </div>
                <div className="rounded-lg bg-orange-50 p-4 text-center dark:bg-orange-900/20">
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Horas Restantes
                  </Text>
                  <Subheading className="text-2xl">
                    {selectedMember.remainingHours.toFixed(1)}
                  </Subheading>
                </div>
                <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Horas Ejecutadas
                  </Text>
                  <Subheading className="text-2xl">
                    {(
                      selectedMember.hours - selectedMember.remainingHours
                    ).toFixed(1)}
                  </Subheading>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Total Ejecutado
                  </Text>
                  <Subheading className="text-xl">
                    <Currency
                      defaultFCA={
                        !Boolean(
                          selectedMember.teamMember?.categories.at(-1)
                            ?.pointsObrero
                        )
                      }
                      amountIndex={calculateExecutedAmount(
                        selectedMember.executions
                      )}
                    />
                  </Subheading>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <Text className="mb-1 text-sm font-medium text-gray-500">
                    Total Presupuestado
                  </Text>
                  <Subheading className="text-xl text-blue-700 dark:text-blue-300">
                    <Currency
                      defaultFCA={
                        !Boolean(
                          selectedMember.teamMember?.categories.at(-1)
                            ?.pointsObrero
                        )
                      }
                      amountIndex={multiplyAmountIndex(
                        selectedMember.teamMemberId ?
                          calculateHourRateGivenTMCategory(
                            selectedMember.teamMember?.categories.at(-1) ?? null
                          )
                        : calculateHourRateGivenCategory(
                            selectedMember.category
                          ),
                        selectedMember.hours
                      )}
                    />
                  </Subheading>
                </div>
              </div>

              {/* New Execution Section */}
              {!editable &&
                !selectedMember.categoryId &&
                selectedMember.remainingHours > 0 && (
                  <div className="border-t pt-4">
                    <Subheading className="mb-3">Nueva Ejecución</Subheading>
                    <BudgetNewExecution
                      maxAmount={
                        multiplyAmountIndex(
                          selectedMember.teamMemberId ?
                            calculateHourRateGivenTMCategory(
                              selectedMember.teamMember?.categories.at(-1) ??
                                null
                            )
                          : calculateHourRateGivenCategory(
                              selectedMember.category
                            ),
                          selectedMember.remainingHours
                        ).FCA
                      }
                      anualBudgetTeamMemberId={selectedMember.id}
                      executionType={ExecutionType.TeamMember}
                      budgetItemPositionIndex={0}
                    />
                  </div>
                )}

              {/* Execution History */}
              {selectedMember.executions.length > 0 && (
                <div className="border-t pt-4">
                  <Subheading className="mb-3">
                    Historial de Ejecuciones ({selectedMember.executions.length}
                    )
                  </Subheading>
                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {selectedMember.executions
                      .reverse()
                      .map((execution, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                        >
                          <div>
                            <Text className="font-medium">
                              {execution.date.toLocaleDateString('es-ES')}
                            </Text>
                          </div>
                          <Text className="font-semibold">
                            <Currency
                              amountIndex={
                                execution.amountIndex ?? ZeroAmountIndex
                              }
                            />
                          </Text>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {selectedMember.executions.length === 0 &&
                !editable &&
                !selectedMember.categoryId && (
                  <div className="py-6 text-center text-gray-500">
                    <Text>
                      No hay ejecuciones registradas para este miembro.
                    </Text>
                  </div>
                )}
            </div>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={closeMemberDialog}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  )
}
