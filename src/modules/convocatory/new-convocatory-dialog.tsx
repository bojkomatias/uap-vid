'use client'

import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'
import { ConvocatoryForm } from './convocatory-form'
import { useState } from 'react'
import { CalendarPlus } from 'tabler-icons-react'
import { Button } from '@components/button'

export function NewConvocatoryDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} color="primary">
        <CalendarPlus data-slot="icon" />
        Convocatoria
      </Button>

      <Dialog open={open} onClose={setOpen} size="xl">
        <DialogTitle>Crear convocatoria</DialogTitle>
        <DialogDescription>
          Aquí puede crear una nueva convocatoria a cual asignar proyectos de
          investigación
        </DialogDescription>
        <ConvocatoryForm
          convocatory={{
            name: '',
            from: new Date(),
            to: new Date(),
            year: new Date().getFullYear(),
          }}
        />
      </Dialog>
    </>
  )
}
