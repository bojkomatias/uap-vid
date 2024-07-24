'use client'

import { Button } from '@components/button'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@components/description-list'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import type { Role, User } from '@prisma/client'
import { dateFormatter } from '@utils/formatters'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormListbox } from '@shared/form/form-listbox'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import { updateUserRoleById } from '@repositories/user'
import { notifications } from '@elements/notifications'

export function UserDetailsDialog({ user }: { user: Omit<User, 'password'> }) {
  const router = useRouter()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }

  const submitRoleUpdate = async (newRole: Role) => {
    const res = await updateUserRoleById(user.id, newRole)

    if (res)
      return notifications.show({
        title: 'Rol modificado',
        message: 'Se actualizo el rol del usuario correctamente',
        intent: 'success',
      })

    notifications.show({
      title: 'Error',
      message: 'Ocurrio un error al actualizar el rol del usuario',
      intent: 'error',
    })
    router.refresh()
  }

  return (
    <Dialog open={open} onClose={closeDialog} size="2xl">
      <DialogTitle>Detalles de usuario</DialogTitle>
      <DialogDescription>
        Los detalles de usuario y la opción de modificar el rol del mismo.
      </DialogDescription>
      <DialogBody>
        <DescriptionList>
          <DescriptionTerm>UUID</DescriptionTerm>
          <DescriptionDetails>
            <span className="font-mono text-xs">{user.id}</span>
          </DescriptionDetails>
          <DescriptionTerm>Nombre</DescriptionTerm>
          <DescriptionDetails>{user.name}</DescriptionDetails>
          <DescriptionTerm>Email</DescriptionTerm>
          <DescriptionDetails>{user.email}</DescriptionDetails>
          <DescriptionTerm>DNI</DescriptionTerm>
          <DescriptionDetails>{user.dni}</DescriptionDetails>
          <DescriptionTerm>Ultima vez visto</DescriptionTerm>
          <DescriptionDetails>
            {dateFormatter.format(user.lastLogin!)}
          </DescriptionDetails>
          <DescriptionTerm>Role</DescriptionTerm>
          <DescriptionDetails>
            <FormListbox
              label="Rol"
              description="Actualizar el rol del usuario"
              options={Object.entries(RolesDictionary).map(
                ([value, label]) => ({
                  value,
                  label,
                })
              )}
              onChange={(e: any) => {
                submitRoleUpdate(e)
              }}
            />
          </DescriptionDetails>
        </DescriptionList>
      </DialogBody>
      <DialogActions>
        <Button>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
