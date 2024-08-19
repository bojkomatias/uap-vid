'use client'

import type { Logs } from '@prisma/client'
import { Button } from '@components/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '@components/dialog'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ViewLogsDialog({ logs }: { logs: Logs[] | null }) {
  const router = useRouter()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }
  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle></DialogTitle>
      <DialogBody>
        {!logs ?
          'No se encontraron logs'
        : <pre>{JSON.stringify(logs.at(-1), null, 2)}</pre>}
      </DialogBody>
      <DialogActions>
        <Button plain onClick={closeDialog}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
