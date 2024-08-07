'use client'

import { Button } from '@components/button'
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { Divider } from '@components/divider'
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
      <Dialog open={open} onClose={() => setOpen(false)} size="xl">
        <DialogTitle>Metodólogo y evaluadores</DialogTitle>
        <DialogDescription className="!text-xs/5">
          Reasignar evaluador eliminará si existe una revision del mismo tipo ya
          creada. Solo puede existir una sola evaluación correspondiente a cada
          etapa del proyecto.
        </DialogDescription>
        <Divider className="my-3" />
        {children}
        <DialogActions>
          <Button plain onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
