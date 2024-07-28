'use client'
import { BadgeButton } from '@components/badge'
import React from 'react'
import { Clipboard as ClipboardCopy } from 'tabler-icons-react'
import { notifications } from './notifications'

export default function Clipboard({
  content,
  notification_message,
}: {
  content: string
  notification_message?: string
}) {
  return (
    <BadgeButton
      title="Copiar"
      onClick={() => {
        navigator.clipboard.writeText(content)
        notifications.show({
          title: 'Texto copiado',
          message:
            notification_message ? notification_message : (
              'Se copió el texto seleccionado'
            ),
          intent: 'success',
        })
      }}
    >
      <ClipboardCopy className="size-4" />
    </BadgeButton>
  )
}
