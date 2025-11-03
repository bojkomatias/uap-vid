'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@components/button'
import { AlertCircle, X } from 'tabler-icons-react'
import { notifications } from '@elements/notifications'

export function ImpersonationBanner() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const isImpersonating = session?.impersonating?.isActive

  // Add padding to body when banner is visible
  useEffect(() => {
    if (isImpersonating) {
      document.body.style.paddingTop = '52px'
    } else {
      document.body.style.paddingTop = '0'
    }
    return () => {
      document.body.style.paddingTop = '0'
    }
  }, [isImpersonating])

  // Only show if impersonating
  if (!isImpersonating) {
    return null
  }

  const handleStopImpersonation = async () => {
    try {
      setIsLoading(true)
      const originalUserName = session?.impersonating?.originalUser.name || 'administrador'

      const response = await fetch('/api/auth/impersonate/stop', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to stop impersonation')
      }

      notifications.show({
        title: 'Sesión restaurada',
        message: `Ha vuelto a su cuenta de ${originalUserName}`,
        intent: 'success',
      })

      // Reload the page to get the new session
      window.location.href = '/protocols'
    } catch (error) {
      console.error('Stop impersonation error:', error)
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ?
            error.message
          : 'Error al salir de impersonación',
        intent: 'error',
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-4 bg-amber-500 px-4 py-3 text-white shadow-lg print:hidden">
      <AlertCircle className="h-5 w-5" />
      <p className="text-sm font-medium">
        Está impersonando a <strong>{session.user.name}</strong> (
        {session.user.email})
      </p>
      <Button
        color="white"
        onClick={handleStopImpersonation}
        disabled={isLoading}
        className="ml-auto"
      >
        <X className="h-4 w-4" />
        Salir de impersonación
      </Button>
    </div>
  )
}
