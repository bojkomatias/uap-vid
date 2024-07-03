'use client'

import { Button } from '@components/button'
import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'
import { useState } from 'react'
import { BrowserPlus } from 'tabler-icons-react'
import type { z } from 'zod'
import { AcademicUnitForm } from './academic-unit-form'

export function NewAcademicUnitFormDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <BrowserPlus data-slot="icon" />
        Unidad Académica
      </Button>

      <Dialog open={open} onClose={setOpen} size="xl">
        <DialogTitle>Crear unidad académica</DialogTitle>
        <DialogDescription>
          Aquí puede crear una nueva unidad académica, son los entes
          patrocinantes de los proyectos y se le pueden asignar secretarios para
          coordinarlas.
        </DialogDescription>
        <AcademicUnitForm academicUnit={{ name: '', shortname: '' }} />
      </Dialog>
    </>
  )
}
