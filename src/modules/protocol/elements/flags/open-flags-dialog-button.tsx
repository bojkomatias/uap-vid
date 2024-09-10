'use client'
import React from 'react'
import { FlagsDialogAtom } from './flags-dialog'
import { useAtom } from 'jotai'
import { BadgeButton } from '@components/badge'
import { ContextMenuAtom } from '@shared/context-menu'
import { Flag } from 'tabler-icons-react'

export default function OpenFlagsDialog() {
  const [flags, setFlags] = useAtom(FlagsDialogAtom)
  const [contextMenu, setContextMenu] = useAtom(ContextMenuAtom)

  return (
    <BadgeButton
      onClick={() => {
        setFlags(true)
        setContextMenu(false)
      }}
      className="flex grow justify-between shadow-sm"
    >
      Votos <Flag size={18} />
    </BadgeButton>
  )
}
