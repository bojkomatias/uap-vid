'use client'

import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'

import { useState } from 'react'
import { RefreshDot } from 'tabler-icons-react'
import { Button } from '@components/button'

export function UpdateIndexDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <RefreshDot data-slot="icon" /> Actualizar indices
      </Button>

      <Dialog open={open} onClose={setOpen} size="xl">
        <DialogTitle>Actualizar indices</DialogTitle>
        <DialogDescription>
          La mayoría de la applicación responde en base a los indices cargados,
          recuerde mantenerlos al día. Puede actualizar un indice a la vez si
          desea.
        </DialogDescription>
        <DialogBody></DialogBody>
        <DialogActions></DialogActions>
      </Dialog>
    </>
  )
}
