'use client'
import { BadgeButton } from '@components/badge'
import React from 'react'
import { Clipboard as ClipboardCopy } from 'tabler-icons-react'
import { notifications } from './notifications'

export default function Clipboard({ content }: { content: string }) {
  return (
    <BadgeButton
      title="Copiar"
      onClick={() => {
        navigator.clipboard.writeText(content)
        notifications.show({
          title: 'Texto copiado',
          message: 'Se copió el texto seleccionado',
          intent: 'success',
        })
      }}
    >
      <ClipboardCopy className="size-4" />
    </BadgeButton>
  )
}
