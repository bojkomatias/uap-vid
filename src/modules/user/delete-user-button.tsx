'use client'

import { Button } from '@components/button'
import { notifications } from '@elements/notifications'
import { deleteUserById } from '@repositories/user'
import { useRouter } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import { Loader2 } from 'tabler-icons-react'

let timeout: NodeJS.Timeout

export function DeleteUserButton({ userId }: { userId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleting, setDeleting] = useState(false)

  const deleteUser = useCallback(async () => {
    const deleted = await deleteUserById(userId)

    if (deleted) {
      notifications.show({
        title: 'Usuario eliminado',
        message: 'El usuario ha sido eliminado con éxito.',
        intent: 'success',
      })
      return startTransition(() => router.refresh())
    }
    notifications.show({
      title: 'No se pudo eliminar usuario',
      message:
        'El usuario esta vinculado con algún protocolo y no se puede eliminar.',
      intent: 'error',
    })
    setDeleting(false)
    return startTransition(() => router.refresh())
  }, [router, userId])

  return deleting ?
      <Button
        color="red"
        className="w-40 whitespace-nowrap"
        onClick={() => {
          clearTimeout(timeout)
          setDeleting(false)
        }}
        disabled={isPending}
      >
        <Loader2 data-slot="icon" className="size-3 animate-spin" />
        Cancelar
      </Button>
    : <Button
        color="red"
        className="w-40 whitespace-nowrap"
        onClick={() => {
          setDeleting(true)
          timeout = setTimeout(() => {
            deleteUser()
          }, 3000)
        }}
        disabled={isPending}
      >
        Eliminar usuario
      </Button>
}
