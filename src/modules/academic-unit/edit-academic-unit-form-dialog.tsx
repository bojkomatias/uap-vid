'use client'

import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'
import type { AcademicUnitSchema } from '@utils/zod'
import { useEffect, useState } from 'react'
import type { z } from 'zod'
import { AcademicUnitForm } from './academic-unit-form'

export function EditAcademicUnitFormDialog({
  onClose,
  academicUnit,
}: {
  onClose: () => void
  academicUnit?: z.infer<typeof AcademicUnitSchema>
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (academicUnit) setOpen(true)
  }, [academicUnit])

  const closeModal = () => {
    setOpen(false)
    setTimeout(() => onClose(), 200)
  }

  return (
    <Dialog open={open} onClose={closeModal} size="xl">
      <DialogTitle>Crear unidad académica</DialogTitle>
      <DialogDescription>
        Aquí puede crear una nueva unidad académica, son los entes patrocinantes
        de los proyectos y se le pueden asignar secretarios para coordinarlas.
      </DialogDescription>
      {academicUnit && (
        <AcademicUnitForm
          academicUnit={academicUnit}
          onSubmitCallback={closeModal}
        />
      )}
    </Dialog>
  )
}
