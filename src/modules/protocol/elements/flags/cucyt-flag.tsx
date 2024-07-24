'use client'
import { useForm } from '@mantine/form'
import type { ProtocolFlag } from '@prisma/client'
import { upsertProtocolFlag } from '@repositories/protocol'
import React from 'react'
import { FormSwitch } from '../../../../shared/form/form-switch'

export default function CucytFlag({
  protocolId,
  protocolFlag,
}: {
  protocolId: string
  protocolFlag?: ProtocolFlag
}) {
  const form = useForm({
    initialValues: {
      flagName: 'CUCYT',
      state: protocolFlag ? protocolFlag.state : false,
    },
  })

  const submitCucytFlag = async (
    flag: Omit<ProtocolFlag, 'createdAt' | 'updatedAt'>
  ) => {
    await upsertProtocolFlag(protocolId, flag)
  }

  return (
    <FormSwitch
      label="Aprobado por el CUCYT"
      description={form.getValues().state ? 'Aprobado' : 'No aprobado'}
      checked={form.getInputProps('state').value}
      {...form.getInputProps('state')}
      onChange={() => {
        submitCucytFlag(form.getValues())
      }}
    />
  )
}
