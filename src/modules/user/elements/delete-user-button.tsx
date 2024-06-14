'use client'
import { Button } from '@elements/button'
import { notifications } from '@elements/notifications'
import { deleteUserById } from '@repositories/user'
import { useRouter } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

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
        onClick={() => {
          clearTimeout(timeout)
          setDeleting(false)
        }}
        disabled={isPending}
        intent="destructive"
        size="xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
            opacity=".25"
          ></path>
          <path
            fill="currentColor"
            d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
          >
            <animateTransform
              attributeName="transform"
              dur="0.75s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            ></animateTransform>
          </path>
        </svg>
        Cancelar
      </Button>
    : <Button
        onClick={() => {
          setDeleting(true)
          timeout = setTimeout(() => {
            deleteUser()
          }, 3000)
        }}
        disabled={isPending}
        intent="destructive"
        size="xs"
      >
        Eliminar
      </Button>
}
