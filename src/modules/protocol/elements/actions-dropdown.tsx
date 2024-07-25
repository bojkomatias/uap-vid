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
}

export function ActionsDropdown({
  actions,
  protocolId,
  protocolState,
  userId,
  canEdit,
}: {
  actions: Action[]
  protocolId: string
  protocolState: ProtocolState
  userId: string
  canEdit: boolean
}) {
  const router = useRouter()
  const [isPending, startTranstion] = useTransition()

  const actionsToOptions: ActionOption[] = [
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
      icon: <Flag2 data-slot="icon" />,
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
      icon: <Shape data-slot="icon" />,
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
      icon: <Trash data-slot="icon" />,
    },
  ]

  return (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDown data-slot="icon" />
      </DropdownButton>
      <DropdownMenu anchor="bottom end">
        {canEdit && (
          <>
            <DropdownItem
              disabled={isPending}
              href={`/protocols/${protocolId}/0`}
            >
              <Edit data-slot="icon" />
              <DropdownLabel>Editar</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
          </>
        )}
        {actionsToOptions
          .filter((a) => actions.includes(a.action))
          .map((x) => (
            <DropdownItem
              key={x.action}
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
      </DropdownMenu>
    </Dropdown>
  )
}
