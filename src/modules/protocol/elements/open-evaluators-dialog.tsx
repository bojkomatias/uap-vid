'use client'

import { Button } from '@components/button'
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
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
          De acuerdo al estado del protocolo los evaluadores asignados. Si el
          estado lo permite se puede reasignar dichos evaluadores, teniendo en
          cuenta que esto limpia la revision realizada de haberse hecho una.
        </DialogDescription>
        {children}
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
