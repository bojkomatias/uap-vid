'use client'

import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'
import { useState } from 'react'
import { Button } from '@components/button'
import { UserForm } from './user-form'
import { UserPlus } from 'tabler-icons-react'

export function NewUserDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus data-slot="icon" />
        Usuario
      </Button>

      <Dialog open={open} onClose={setOpen} size="2xl">
        <DialogTitle>Crear usuario</DialogTitle>
        <DialogDescription>
          Aquí puede crear un nuevo usuario para otorgarle acceso al sistema.
          Tenga en cuenta que no pasa por Office 365
        </DialogDescription>
        <UserForm />
      </Dialog>
    </>
  )
}
