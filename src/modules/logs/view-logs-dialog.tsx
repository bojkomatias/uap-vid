'use client'

import { Action, type Prisma } from '@prisma/client'
import { Button } from '@components/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@components/description-list'
import { dateFormatter } from '@utils/formatters'
import { Strong, Text, TextLink } from '@components/text'

type Log = Prisma.LogsGetPayload<{
  include: {
    user: { select: { name: true } }
    reviewer: { select: { name: true } }
  }
}>

export function ViewLogsDialog({ logs }: { logs: Log[] | null }) {
  const router = useRouter()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }
  return (
    <Dialog open={open} onClose={closeDialog} size="2xl">
      <DialogTitle>Lista de logs</DialogTitle>
      <DialogDescription>Viendo los logs filtrados por: </DialogDescription>
      <DialogBody className="space-y-4">
        {!logs ?
          <Text>No se encontraron logs</Text>
        : logs.map((log) => (
            <div key={log.id}>
              <LogCard log={log} />
            </div>
          ))
        }
      </DialogBody>
      <DialogActions>
        <Button plain onClick={closeDialog}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function LogCard({ log }: { log: Log }) {
  return (
    <>
      <Text className="ml-1 !text-xs">
        {dateFormatter.format(log.createdAt)}
      </Text>

      {log.action ?
        <Text>
          <Strong>{log.user.name}</Strong>{' '}
          {logActionToText(log.action, log.reviewer?.name)}
        </Text>
      : <Text>{log.message}</Text>}
    </>
  )
}

const logActionToText = (action: Action, interpolated?: string) => {
  if (action === Action.PUBLISH) return 'ha publicado el proyecto'
  if (action === Action.ASSIGN_TO_METHODOLOGIST)
    return (
      <>
        ha asignado a <Strong>{interpolated}</Strong> como metodólogo
      </>
    )
  if (action === Action.ASSIGN_TO_SCIENTIFIC)
    return (
      <>
        ha asignado a <Strong>{interpolated}</Strong> como evaluador científico
      </>
    )
  if (action === Action.ACCEPT)
    return 'ha marcado el proyecto como aceptado por los evaluadores'
  if (action === Action.APPROVE) return 'ha puesto en curso el proyecto'
  if (action === Action.FINISH) return 'ha marcado el proyecto como finalizado'
  if (action === Action.DISCONTINUE)
    return 'ha marcado el proyecto como discontinuado'
  if (action === Action.DELETE) return 'ha borrado el proyecto'
  if (action === Action.REACTIVATE) return 'ha reactivado el proyecto'
}
