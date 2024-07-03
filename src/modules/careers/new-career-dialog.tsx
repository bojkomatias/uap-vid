'use client'

import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'
import { useState } from 'react'
import { CalendarPlus } from 'tabler-icons-react'
import { Button } from '@components/button'
import { NewCareerForm } from './new-career-form'

export function NewCareerDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <CalendarPlus data-slot="icon" />
        Agregar carrera
      </Button>

      <Dialog open={open} onClose={setOpen} size="xl">
        <DialogTitle>Agregar carrera</DialogTitle>
        <DialogDescription>
          Agregar una nueva carrera con sus materias correspondientes
        </DialogDescription>
        <NewCareerForm
          career={{
            name: '',
            active: true,
            courses: [],
          }}
        />
      </Dialog>
    </>
  )
}
