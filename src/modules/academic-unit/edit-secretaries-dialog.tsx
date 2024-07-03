'use client'

import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'
import { Text, TextLink } from '@components/text'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type {
  AcademicUnitWithSecretaries,
  Secretary,
} from './edit-secretaries-form'
import { EditSecretariesForm } from './edit-secretaries-form'

export function EditSecretariesDialog({
  academicUnit,
  secretaries,
}: {
  academicUnit: AcademicUnitWithSecretaries
  secretaries: Secretary[] | null
}) {
  const router = useRouter()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }

  return (
    <Dialog open={open} onClose={closeDialog} size="3xl">
      <div className="flex items-center gap-2">
        <DialogTitle>{academicUnit.name}</DialogTitle>
      </div>
      <DialogDescription>
        Asigne secretarios a la unidad academica, recien una vez enviado el
        formulario se va a actualizar con los datos modificados
      </DialogDescription>
      {!secretaries ?
        <Text>
          No hay secretarios en el sistema, visite el panel de{' '}
          <TextLink href="/users">usuarios</TextLink>{' '}
        </Text>
      : <EditSecretariesForm
          academicUnit={academicUnit}
          secretaries={secretaries}
          onSubmitCallback={closeDialog}
        />
      }
    </Dialog>
  )
}
