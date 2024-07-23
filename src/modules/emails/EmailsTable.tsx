'use client'
import React, { useState } from 'react'
import { Heading, Subheading } from '../../components/heading'
import { useCasesDictionary } from '@utils/emailer/use-cases'
import { Dialog } from '@components/dialog'
import { EmailContentTemplate } from '@prisma/client'
import { Button } from '@headlessui/react'
import { Divider } from '@components/divider'
import { FormInput } from '@shared/form/form-input'

export default function EmailsTable({
  emails,
}: {
  emails: EmailContentTemplate[]
}) {
  const [open, setOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<EmailContentTemplate>()
  const useCases = emails?.map((e) => e.useCase)

  return (
    <div className="text-primary-950">
      <Heading>Emails</Heading>
      <Subheading>
        Puede editar el asunto y contenido de los emails que salen del sistema
        dependiendo del caso de uso.
      </Subheading>
      <p className="my-2 text-lg font-semibold text-gray-600">Casos de uso:</p>
      <div className="flex flex-wrap gap-2">
        {useCases?.map((uc) => (
          <Button
            key={uc}
            onClick={() => {
              setOpen(true)
              setDialogContent(emails.find((e) => e.useCase == uc))
            }}
            className="cursor-pointer rounded-lg border p-4 text-lg font-medium drop-shadow-sm transition hover:shadow-lg"
          >
            {useCasesDictionary[uc as keyof typeof useCasesDictionary]}
          </Button>
        ))}
      </div>
      <Dialog open={open} onClose={setOpen}>
        <Heading className="text-primary-950">
          {
            useCasesDictionary[
              dialogContent!.useCase as keyof typeof useCasesDictionary
            ]
          }
        </Heading>
        <Divider />
        <div className="mt-4 flex items-center gap-2">
          <label className="text-sm text-gray-600">Asunto:</label>
          <input
            defaultValue={dialogContent?.subject}
            className="flex-grow border-b text-primary-950 outline-none"
          />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <label className="text-sm text-gray-600">Contenido:</label>
          <input
            defaultValue={dialogContent?.subject}
            className="flex-grow border-b text-primary-950 outline-none"
          />
        </div>
      </Dialog>
    </div>
  )
}
