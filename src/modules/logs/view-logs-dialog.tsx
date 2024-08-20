'use client'

import { Action, Logs } from '@prisma/client'
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
import { Text, TextLink } from '@components/text'

export function ViewLogsDialog({ logs }: { logs: Logs[] | null }) {
  const router = useRouter()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }
  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>Lista de logs</DialogTitle>
      <DialogDescription>Viendo los logs filtrados por: </DialogDescription>
      <DialogBody>
        {!logs ?
          'No se encontraron logs'
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

function LogCard({ log }: { log: Logs }) {
  return (
    <DescriptionList>
      <DescriptionTerm>{dateFormatter.format(log.createdAt)}</DescriptionTerm>
      <DescriptionDetails>
        {log.message ?
          log.message
        : <>
            <Text>
              El <TextLink href={`/users/${log.userId}`}>usuario</TextLink>
            </Text>
          </>
        }
      </DescriptionDetails>
    </DescriptionList>
  )
}

// El usuario (link to user)

const logActionMessage = (action: Action) => {
  return
}
