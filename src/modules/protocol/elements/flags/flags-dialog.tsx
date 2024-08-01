'use client'

import React from 'react'
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
import { atom, useAtom } from 'jotai'

export const FlagsDialogAtom = atom<boolean>(false)
export default function FlagsDialog({
  protocolId,
  protocolFlags,
}: {
  protocolId: string
  protocolFlags: ProtocolFlag[]
}) {
  const [open, setOpen] = useAtom(FlagsDialogAtom)

  return (
    <Dialog open={open} onClose={setOpen} size="xl">
      <DialogTitle>Votos de las comisiones</DialogTitle>
      <DialogDescription>
        Votos emitidos por las comisiones encargadas de aprobar los prespuestos
        para el proyecto.
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
  )
}
