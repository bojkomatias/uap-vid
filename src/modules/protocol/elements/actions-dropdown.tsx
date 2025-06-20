'use client'

import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@components/dropdown'
import { notifications } from '@elements/notifications'
import type { Prisma } from '@prisma/client'
import { Action, ProtocolState, Role } from '@prisma/client'
import { getSecretariesEmailsByAcademicUnit } from '@repositories/academic-unit'
import { updateProtocolStateById } from '@repositories/protocol'
import { ActionDictionary } from '@utils/dictionaries/ActionDictionary'
import { emailer } from '@utils/emailer'
import { useCases } from '@utils/emailer/use-cases'
import { useRouter } from 'next/navigation'
import { useTransition, type ReactNode, useState } from 'react'
import {
  Badge,
  ChevronDown,
  ClockPause,
  Edit,
  FileDollar,
  FileTime,
  Flag2,
  Trash,
  FileDownload,
  HandStop,
  FileSpreadsheet,
  AlertTriangle,
} from 'tabler-icons-react'
import { FlagsDialogAtom } from './flags/flags-dialog'
import { ProtocolSchema } from '@utils/zod'
import { useAtom } from 'jotai'
import { reactivateProtocolAndAnualBudget } from '@actions/anual-budget/action'
import { getAdmins, getUsers } from '@repositories/user'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { Button } from '@components/button'

type ActionOption = {
  action: Action
  icon: ReactNode
  callback: () => void
  color?: string
}

type CheckResults = {
  publish: {
    isValid: boolean
    hasConvocatory: boolean
    message: string
  }
  accept: {
    allReviewed: boolean
    message: string
  }
  approve: {
    allFlagsValid: boolean
    hasRequiredFlags: boolean
    message: string
  }
}

export function ActionsDropdown({
  actions,
  protocol,
  canViewLogs,
  userRole,
  checkResults,
}: {
  actions: Action[]
  protocol: Prisma.ProtocolGetPayload<{
    include: {
      researcher: { select: { id: true; name: true; email: true } }
      convocatory: { select: { id: true; name: true } }
      anualBudgets: {
        select: { createdAt: true; year: true; id: true }
      }
    }
  }>
  canViewLogs?: boolean
  userRole: Role
  checkResults: CheckResults
}) {
  const router = useRouter()
  const [isPending, startTranstion] = useTransition()
  const [adminOverrideDialog, setAdminOverrideDialog] = useState<{
    open: boolean
    action: Action | null
    message: string
    callback: (() => void) | null
  }>({
    open: false,
    action: null,
    message: '',
    callback: null,
  })

  const isAdmin = userRole === 'ADMIN'

  const handleAdminOverride = (
    action: Action,
    message: string,
    callback: () => void
  ) => {
    if (isAdmin) {
      setAdminOverrideDialog({
        open: true,
        action,
        message,
        callback,
      })
    } else {
      callback()
    }
  }

  const executeWithOverride = () => {
    if (adminOverrideDialog.callback) {
      adminOverrideDialog.callback()
      startTranstion(() => router.refresh())
    }
    setAdminOverrideDialog({
      open: false,
      action: null,
      message: '',
      callback: null,
    })
  }

  const actionsToOptions: ActionOption[] = [
    {
      action: Action.EDIT,
      callback: async () => router.push(`/protocols/${protocol.id}/0`),
      icon: <Edit data-slot="icon" />,
    },
    {
      action: Action.PUBLISH,
      callback: async () => {
        // Check if admin and protocol doesn't pass validation
        if (
          isAdmin &&
          (!checkResults.publish.isValid ||
            !checkResults.publish.hasConvocatory)
        ) {
          const message =
            checkResults.publish.message ||
            'El protocolo no cumple con los requisitos para ser publicado.'
          handleAdminOverride(Action.PUBLISH, message, async () => {
            const updated = await updateProtocolStateById(
              protocol.id,
              Action.PUBLISH,
              protocol.state,
              ProtocolState.PUBLISHED
            )
            const secretariesEmails = async (academicUnits: string[]) => {
              const secretaryEmailPromises = academicUnits.map(async (s) => {
                return await getSecretariesEmailsByAcademicUnit(s)
              })

              const secretaryEmails = (
                await Promise.all(secretaryEmailPromises)
              ).flat()

              return secretaryEmails
                .map((s) => {
                  return s?.secretaries.map((e) => {
                    return e.email
                  })
                })
                .flat()
            }

            if (updated.status && updated.data) {
              ;(
                await secretariesEmails(
                  updated.data.sections.identification.sponsor
                )
              ).forEach((email) => {
                emailer({
                  useCase: useCases.onPublish,
                  email: email!,
                  protocolId: updated.data.id,
                })
              })
              //Notify admin when a protocol is being created when there's no open convocatory
              if (!protocol.convocatory) {
                ;(await getAdmins())?.forEach((admin) => {
                  emailer({
                    useCase: useCases.onPublish,
                    email: admin.email!,
                    protocolId: updated.data.id,
                  })
                })
              }
            } else {
              console.log(
                'No se pudo enviar emails a los secretarios de investigación'
              )
            }
            notifications.show(updated.notification)
          })
          return
        }

        // Normal flow for non-admin or valid protocol
        const parsed = ProtocolSchema.safeParse(protocol)
        if (parsed.error)
          return notifications.show({
            title: 'El protocolo no está completo',
            message:
              'Debe completar todas las secciones y los campos requeridos antes de poder publicarlo',
            intent: 'error',
          })
        // Continues only if parsing goes right
        const updated = await updateProtocolStateById(
          protocol.id,
          Action.PUBLISH,
          protocol.state,
          ProtocolState.PUBLISHED
        )
        const secretariesEmails = async (academicUnits: string[]) => {
          const secretaryEmailPromises = academicUnits.map(async (s) => {
            return await getSecretariesEmailsByAcademicUnit(s)
          })

          const secretaryEmails = (
            await Promise.all(secretaryEmailPromises)
          ).flat()

          return secretaryEmails
            .map((s) => {
              return s?.secretaries.map((e) => {
                return e.email
              })
            })
            .flat()
        }

        if (updated.status && updated.data) {
          ;(
            await secretariesEmails(
              updated.data.sections.identification.sponsor
            )
          ).forEach((email) => {
            emailer({
              useCase: useCases.onPublish,
              email: email!,
              protocolId: updated.data.id,
            })
          })
          //Notify admin when a protocol is being created when there's no open convocatory
          if (!protocol.convocatory) {
            ;(await getAdmins())?.forEach((admin) => {
              emailer({
                useCase: useCases.onPublish,
                email: admin.email!,
                protocolId: updated.data.id,
              })
            })
          }
        } else {
          console.log(
            'No se pudo enviar emails a los secretarios de investigación'
          )
        }
        notifications.show(updated.notification)
      },
      icon: <FileTime data-slot="icon" />,
    },
    {
      action: Action.ACCEPT,
      callback: async () => {
        // Check if admin and reviews are not complete
        if (isAdmin && !checkResults.accept.allReviewed) {
          const message =
            checkResults.accept.message ||
            'No todas las evaluaciones han sido completadas.'
          handleAdminOverride(Action.ACCEPT, message, async () => {
            const updated = await updateProtocolStateById(
              protocol.id,
              Action.ACCEPT,
              protocol.state,
              ProtocolState.ACCEPTED
            )
            notifications.show(updated.notification)
          })
          return
        }

        // Normal flow
        const updated = await updateProtocolStateById(
          protocol.id,
          Action.ACCEPT,
          protocol.state,
          ProtocolState.ACCEPTED
        )
        notifications.show(updated.notification)
      },
      icon: <Badge data-slot="icon" />,
    },
    {
      action: Action.APPROVE,
      callback: async () => {
        // Check if admin and flags are not valid
        if (
          isAdmin &&
          (!checkResults.approve.allFlagsValid ||
            !checkResults.approve.hasRequiredFlags)
        ) {
          const message =
            checkResults.approve.message ||
            'Las banderas del protocolo no están aprobadas o faltan banderas requeridas.'
          handleAdminOverride(Action.APPROVE, message, async () => {
            const updated = await updateProtocolStateById(
              protocol.id,
              Action.APPROVE,
              protocol.state,
              ProtocolState.ON_GOING
            )
            notifications.show(updated.notification)
          })
          return
        }

        // Normal flow
        const updated = await updateProtocolStateById(
          protocol.id,
          Action.APPROVE,
          protocol.state,
          ProtocolState.ON_GOING
        )
        notifications.show(updated.notification)
      },
      icon: <Badge data-slot="icon" />,
    },
    {
      action: Action.GENERATE_ANUAL_BUDGET,
      callback: () =>
        router.push(`/generate-budget/${protocol.id}`, { scroll: false }),
      icon: <FileDollar data-slot="icon" />,
    },
  ]

  const endingActions: ActionOption[] = [
    {
      action: Action.REACTIVATE,
      callback: async () => {
        const updated = await reactivateProtocolAndAnualBudget(protocol.id)
        notifications.show(updated.notification)
      },
      icon: <Badge data-slot="icon" className="stroke-emerald-500" />,
    },
    {
      action: Action.FINISH,
      callback: async () => {
        const updated = await updateProtocolStateById(
          protocol.id,
          Action.GENERATE_ANUAL_BUDGET,
          protocol.state,
          ProtocolState.FINISHED
        )
        notifications.show(updated.notification)
      },
      icon: <Flag2 data-slot="icon" className="stroke-green-500" />,
    },
    {
      action: Action.DISCONTINUE,
      callback: async () => {
        const updated = await updateProtocolStateById(
          protocol.id,
          Action.DISCONTINUE,
          protocol.state,
          ProtocolState.DISCONTINUED
        )
        notifications.show(updated.notification)
      },
      icon: <ClockPause data-slot="icon" className="stroke-yellow-500" />,
    },
    {
      action: Action.DELETE,
      callback: async () => {
        const updated = await updateProtocolStateById(
          protocol.id,
          Action.DELETE,
          protocol.state,
          ProtocolState.DELETED
        )
        notifications.show(updated.notification)
      },
      icon: <Trash data-slot="icon" className="stroke-red-500" />,
    },
  ]

  const canViewBudgets = actions.includes(Action.VIEW_ANUAL_BUDGET)

  const [open, setOpen] = useAtom(FlagsDialogAtom)

  return (
    <>
      <Dropdown>
        <DropdownButton className="h-9" color="light">
          Acciones
          <ChevronDown data-slot="icon" />
        </DropdownButton>

        <DropdownMenu anchor="bottom end">
          {/* Actions that are used in the lifetime of a project */}
          {actionsToOptions
            .filter((a) => actions.includes(a.action))
            .map((x, i) => (
              <DropdownItem
                key={i}
                disabled={isPending}
                onClick={() => {
                  if (x.callback) {
                    x.callback()
                    if (!adminOverrideDialog.open) {
                      startTranstion(() => router.refresh())
                    }
                  }
                }}
              >
                {x.icon}
                <DropdownLabel>{ActionDictionary[x.action]}</DropdownLabel>
              </DropdownItem>
            ))}
          <DropdownItem
            onClick={(e: any) => {
              setOpen(true)
            }}
          >
            <HandStop data-slot="icon" />
            <DropdownLabel>Votos </DropdownLabel>
          </DropdownItem>

          {/* Actions that end or pause the lifetime of a project */}
          {endingActions.length > 0 ?
            <DropdownDivider />
          : null}
          {endingActions
            .filter((a) => actions.includes(a.action))
            .map((x, i) => (
              <DropdownItem
                key={i}
                disabled={isPending}
                onClick={() => {
                  if (x.callback) {
                    x.callback()
                    startTranstion(() => router.refresh())
                  }
                }}
              >
                {x.icon}
                <DropdownLabel>{ActionDictionary[x.action]}</DropdownLabel>
              </DropdownItem>
            ))}

          {/* Miscelaneous actions */}
          <DropdownDivider />
          {canViewBudgets ?
            protocol.anualBudgets.map((budget) => (
              <DropdownItem
                key={budget.id}
                disabled={isPending}
                onClick={() => {
                  router.push(`/anual-budget-view/${budget.id}`, {
                    scroll: false,
                  })
                }}
              >
                <FileDollar data-slot="icon" />
                <DropdownLabel>Presupuesto {budget.year}</DropdownLabel>
              </DropdownItem>
            ))
          : null}
          {canViewLogs ?
            <DropdownItem href={`/logs?protocolId=${protocol.id}`}>
              <FileSpreadsheet data-slot="icon" />
              <DropdownLabel>Ver logs / registros</DropdownLabel>
            </DropdownItem>
          : null}
          <DropdownItem
            onClick={() => {
              window.print()
            }}
          >
            <FileDownload data-slot="icon" />
            <DropdownLabel>Descargar PDF</DropdownLabel>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Admin Override Warning Dialog */}
      <Dialog
        open={adminOverrideDialog.open}
        onClose={() =>
          setAdminOverrideDialog({
            open: false,
            action: null,
            message: '',
            callback: null,
          })
        }
        size="lg"
      >
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="text-yellow-500" />
          Confirmación de Administrador
        </DialogTitle>
        <DialogDescription>
          Está intentando realizar una acción que normalmente requiere que se
          cumplan ciertas condiciones. Como administrador, puede proceder, pero
          tenga en cuenta lo siguiente:
        </DialogDescription>
        <DialogBody>
          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Problema detectado:</strong> {adminOverrideDialog.message}
            </p>
            <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              Al proceder, está aceptando la responsabilidad de esta acción y
              reconoce que el protocolo no cumple con todos los requisitos
              estándar.
            </p>
          </div>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() =>
              setAdminOverrideDialog({
                open: false,
                action: null,
                message: '',
                callback: null,
              })
            }
          >
            Cancelar
          </Button>
          <Button
            color="yellow"
            onClick={executeWithOverride}
            disabled={isPending}
          >
            Proceder como Administrador
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
