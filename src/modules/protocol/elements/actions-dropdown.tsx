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
import { Action, ProtocolState } from '@prisma/client'
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
  Shape,
  Trash,
} from 'tabler-icons-react'

type ActionOption = {
  action: Action
  icon: ReactNode
  callback: () => void
  color?: string
}

export function ActionsDropdown({
  actions,
  protocolId,
  protocolState,
  userId,
}: {
  actions: Action[]
  protocolId: string
  protocolState: ProtocolState
  userId: string
}) {
  const router = useRouter()
  const [isPending, startTranstion] = useTransition()

  const actionsToOptions: (ActionOption | 'divider')[] = [
    {
      action: Action.EDIT,
      callback: async () => router.push(`/protocols/${protocolId}/0`),
      icon: <Edit data-slot="icon" />,
    },
    {
      action: Action.PUBLISH,
      callback: async () => {
        const updated = await updateProtocolStateById(
          protocolId,
          protocolState,
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
          protocolId,
          protocolState,
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
        router.push(`/generate-budget/${protocolId}`, { scroll: false }),
      icon: <FileDollar data-slot="icon" />,
    },
    'divider',
    {
      action: Action.FINISH,
      callback: async () => {
        const updated = await updateProtocolStateById(
          protocolId,
          protocolState,
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
          protocolId,
          protocolState,
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
          protocolId,
          protocolState,
          ProtocolState.DELETED,
          userId
        )
        notifications.show(updated.notification)
      },
      icon: <Trash data-slot="icon" className="stroke-red-500" />,
    },
  ]

  return (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDown data-slot="icon" />
      </DropdownButton>
      <DropdownMenu anchor="bottom end">
        {actionsToOptions
          .filter((a) => a == 'divider' || actions.includes(a.action))
          .map((x, i) =>
            x !== 'divider' ?
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
            : i > 0 ? <DropdownDivider key={i} />
            : null
          )}
      </DropdownMenu>
    </Dropdown>
  )
}
