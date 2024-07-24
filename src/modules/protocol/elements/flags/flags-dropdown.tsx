'use client'
import React, { useState } from 'react'
import CucytFlag from './cucyt-flag'
import CiFlag from './ci-flag'
import type { ProtocolFlag } from '@prisma/client'
import { Dialog } from '@components/dialog'
import { Button } from '@components/button'
import { Divider } from '@components/divider'

export default function FlagsDropdown({
  protocolId,
  protocolFlags,
}: {
  protocolId: string
  protocolFlags: ProtocolFlag[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Votos
      </Button>
      <Dialog open={open} onClose={setOpen}>
        <div className="flex flex-col gap-3 p-3">
          <CucytFlag
            protocolId={protocolId}
            protocolFlag={protocolFlags.find(
              (f: ProtocolFlag) => f.flagName == 'CUCYT'
            )}
          />
          <Divider className="mt-2" />
          <CiFlag
            protocolId={protocolId}
            protocolFlag={protocolFlags.find(
              (f: ProtocolFlag) => f.flagName == 'CI'
            )}
          />
        </div>
      </Dialog>
    </>
  )
}
