'use client'

import { notifications } from '@elements/notifications'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ErrorParsingTeamMembers() {
  const router = useRouter()
  useEffect(() => {
    notifications.show({
      title: 'No es posible generar presupuesto',
      message:
        'Es necesario que todos los miembros de equipo esten correctamente relacionados. Por favor edite la tabla de miembros de equipo y vuelva a intentar.',
      intent: 'error',
    })
    router.back()
  }, [])
  return <></>
}
