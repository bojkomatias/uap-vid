'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@components/button'
import { UserCircle } from 'tabler-icons-react'
import { notifications } from '@elements/notifications'

export function ImpersonateUserButton({
  userId,
  userName,
}: {
  userId: string
  userName: string
}) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  // Only show button if user is admin and not already impersonating
  if (session?.user.role !== 'ADMIN' || session?.impersonating?.isActive) {
    return null
  }

  const handleImpersonate = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/impersonate/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to impersonate user')
      }

      notifications.show({
        title: 'Impersonación exitosa',
        message: `Ahora está impersonando a ${userName}`,
        intent: 'success',
      })

      // Reload the page to get the new session
      window.location.href = '/protocols'
    } catch (error) {
      console.error('Impersonation error:', error)
      notifications.show({
        title: 'Error al impersonar',
        message:
          error instanceof Error ? error.message : 'Error al impersonar usuario',
        intent: 'error',
      })
      setIsLoading(false)
    }
  }

  return (
    <Button
      color="cyan"
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        handleImpersonate()
      }}
      disabled={isLoading}
    >
      <UserCircle size={16} />
      Impersonar
    </Button>
  )
}
