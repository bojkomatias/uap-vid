'use client'

import { Button } from '@components/button'
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { Divider } from '@components/divider'
import { Text } from '@components/text'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { UserSearch } from 'tabler-icons-react'

export function EvaluatorsDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button color="light" onClick={() => setOpen(true)}>
        <UserSearch data-slot="icon" />
        Evaluadores
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Metodólogo y evaluadores</DialogTitle>
        <DialogDescription className="!text-xs/5">
          Solo puede asignar evaluadores luego de que el/la metodólogo/a haya
          completado su evaluación. <br /> Reasignar metodólogo/a o evaluadores
          eliminará la evaluación que haya sido realizada previamente por el/la
          metodólogo o evaluadores.
        </DialogDescription>
        <Divider className="my-4" />
        {children}
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
