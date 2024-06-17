'use client'

import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'

import { useState } from 'react'
import { CalendarPlus } from 'tabler-icons-react'
import { Button } from '@components/button'

export function UpdateIndexDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <CalendarPlus data-slot="icon" />
        Convocatoria
      </Button>

      <Dialog open={open} onClose={setOpen} size="xl">
        <DialogTitle>Actualizar indices</DialogTitle>
        <DialogDescription>
          La mayoría de la applicación responde en base a los indices cargados,
          recuerde mantenerlos al día. Puede actualizar un indice a la vez si
          desea.
        </DialogDescription>
      </Dialog>
    </>
  )
}
