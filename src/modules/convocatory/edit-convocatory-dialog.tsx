'use client'

import type { Convocatory } from '@prisma/client'
import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'
import { useState } from 'react'
import { Badge } from '@components/badge'
import { ConvocatoryForm } from './convocatory-form'
import { useRouter } from 'next/navigation'

export function EditConvocatoryDialog({
  convocatory,
  isCurrent,
}: {
  convocatory: Convocatory
  isCurrent?: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }

  return (
    <Dialog open={open} onClose={closeDialog} size="xl">
      <div className="flex items-center gap-2">
        <DialogTitle>{convocatory.name}</DialogTitle>
        {isCurrent ?
          <Badge color="teal">Activa</Badge>
        : null}
      </div>
      <DialogDescription>
        Tenga en cuenta que esto puede afectar al resto de la applicación
      </DialogDescription>
      <ConvocatoryForm
        convocatory={convocatory}
        onSubmitCallback={closeDialog}
      />
    </Dialog>
  )
}
