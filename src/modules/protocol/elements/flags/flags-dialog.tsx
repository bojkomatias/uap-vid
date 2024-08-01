'use client'

import React, { useState } from 'react'
import CucytFlag from './cucyt-flag'
import CiFlag from './ci-flag'
import type { ProtocolFlag } from '@prisma/client'
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { Divider } from '@components/divider'
import { BadgeButton } from '@components/badge'
import { Flag, HandStop } from 'tabler-icons-react'
import { DropdownItem, DropdownLabel } from '@components/dropdown'

export default function FlagsDialog({
  protocolId,
  protocolFlags,
  context_menu,
}: {
  protocolId: string
  protocolFlags: ProtocolFlag[]
  context_menu?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {context_menu ?
        <BadgeButton
          onClick={() => {
            setOpen(true)
          }}
          className="flex grow justify-between shadow-sm"
        >
          Votos <Flag size={18} />
        </BadgeButton>
      : <DropdownItem
          onClick={(e: any) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen(true)
          }}
        >
          <HandStop data-slot="icon" />
          <DropdownLabel>Votos </DropdownLabel>
        </DropdownItem>
      }
      <Dialog open={open} onClose={() => setOpen(false)} size="xl">
        <DialogTitle>Votos de las comisiones</DialogTitle>
        <DialogDescription>
          Votos emitidos por las comisiones encargadas de aprobar los
          prespuestos para el proyecto.
        </DialogDescription>
        <DialogBody>
          <CucytFlag
            protocolId={protocolId}
            protocolFlag={protocolFlags.find(
              (f: ProtocolFlag) => f.flagName == 'CUCYT'
            )}
          />
          <Divider className="my-4" />
          <CiFlag
            protocolId={protocolId}
            protocolFlag={protocolFlags.find(
              (f: ProtocolFlag) => f.flagName == 'CI'
            )}
          />
        </DialogBody>
      </Dialog>
    </>
  )
}
