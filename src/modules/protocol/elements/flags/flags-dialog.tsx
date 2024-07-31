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
import { Button } from '@components/button'
import { Divider } from '@components/divider'
import { BadgeButton } from '@components/badge'
import { Flag } from 'tabler-icons-react'
import { Fieldset } from '@components/fieldset'

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
      : <Button
          outline
          onClick={() => {
            setOpen(true)
          }}
        >
          Votos
        </Button>
      }
      <Dialog open={open} onClose={setOpen} size="xl">
        <DialogTitle>Votos de parte de la comisión</DialogTitle>
        <DialogDescription>
          Aquí se registran los votos emitidos por la comisión encargada de
          aprobar los prespuestos para el proyecto.
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
