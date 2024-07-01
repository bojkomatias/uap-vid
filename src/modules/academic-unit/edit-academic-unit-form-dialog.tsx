'use client'

import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'
import type { AcademicUnitSchema } from '@utils/zod'
import { useState } from 'react'
import type { z } from 'zod'
import { AcademicUnitForm } from './academic-unit-form'

export function EditAcademicUnitFormDialog({
  onClose,
  academicUnit,
}: {
  onClose: () => void
  academicUnit?: z.infer<typeof AcademicUnitSchema>
}) {
  // const [open, setOpen] = useState(false)

  if (!academicUnit) return

  return (
    <Dialog open={!!academicUnit} onClose={onClose} size="xl">
      <DialogTitle>Crear unidad académica</DialogTitle>
      <DialogDescription>
        Aquí puede crear una nueva unidad académica, son los entes patrocinantes
        de los proyectos y se le pueden asignar secretarios para coordinarlas.
      </DialogDescription>
      <AcademicUnitForm
        academicUnit={academicUnit}
        onSubmitCallback={onClose}
      />
    </Dialog>
  )
}
