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
import { Action, Prisma, Protocol, ProtocolState } from '@prisma/client'
import { getSecretariesEmailsByAcademicUnit } from '@repositories/academic-unit'
import { updateProtocolStateById } from '@repositories/protocol'
import { ActionDictionary } from '@utils/dictionaries/ActionDictionary'
import { emailer } from '@utils/emailer'
import { useCases } from '@utils/emailer/use-cases'
import { useRouter } from 'next/navigation'
import { useTransition, type ReactNode } from 'react'
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
} from 'tabler-icons-react'
import FlagsDialog from './flags/flags-dialog'
import { ProtocolSchema } from '@utils/zod'

type ActionOption = {
  action: Action
  icon: ReactNode
  callback: () => void
  color?: string
}

export function ActionsDropdown({
  actions,
  protocol,
  userId,
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
  userId: string
}) {
  const router = useRouter()
  const [isPending, startTranstion] = useTransition()

  const actionsToOptions: ActionOption[] = [
    {
      action: Action.EDIT,
      callback: async () => router.push(`/protocols/${protocol.id}/0`),
      icon: <Edit data-slot="icon" />,
    },
    {
      action: Action.PUBLISH,
      callback: async () => {
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
          protocol.state,
          ProtocolState.PUBLISHED,
          userId
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
        const updated = await updateProtocolStateById(
          protocol.id,
          protocol.state,
          ProtocolState.ACCEPTED,
          userId
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
      action: Action.FINISH,
      callback: async () => {
        const updated = await updateProtocolStateById(
          protocol.id,
          protocol.state,
          ProtocolState.FINISHED,
          userId
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
          protocol.state,
          ProtocolState.DISCONTINUED,
          userId
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
          protocol.state,
          ProtocolState.DELETED,
          userId
        )
        notifications.show(updated.notification)
      },
      icon: <Trash data-slot="icon" className="stroke-red-500" />,
    },
  ]

  const canViewBudgets = actions.includes('VIEW_ANUAL_BUDGET')

  return (
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
                  startTranstion(() => router.refresh())
                }
              }}
            >
              {x.icon}
              <DropdownLabel>{ActionDictionary[x.action]}</DropdownLabel>
            </DropdownItem>
          ))}
        <FlagsDialog protocolId={protocol.id} protocolFlags={protocol.flags} />

        {/* Actions that end or pause the lifetime of a project */}
        <DropdownDivider />
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
  )
}
