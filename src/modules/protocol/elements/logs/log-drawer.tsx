'use client'
import { dateFormatter } from '@utils/formatters'
import { useState } from 'react'
import { getLogsByProtocolId, newLog } from '@repositories/log'
import { Download, Note } from 'tabler-icons-react'
import CustomDrawer from '@elements/custom-drawer'
import { Divider } from '@components/divider'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from '@mantine/form'
import { FormTextarea } from '@shared/form/form-textarea'
import { FormButton } from '@shared/form/form-button'
import { Fieldset, FormActions } from '@components/fieldset'
import { Subheading } from '@components/heading'
import { Text } from '@components/text'
import { BadgeButton } from '@components/badge'

export default function ProtocolLogsDrawer({
  userId,
  protocolId,
  context_menu,
}: {
  userId: string
  protocolId: string
  context_menu?: boolean
}) {
  const [opened, setOpened] = useState(false)

  function closeFn() {
    document.getElementById('drawer-overlay')?.classList.add('fade-out')
    document.getElementById('drawer-content')?.classList.add('fade-out-right')

    setTimeout(() => {
      setOpened(false)
    }, 300)
  }

  const { data: logs, refetch } = useQuery({
    queryKey: ['logs', protocolId],
    queryFn: async () => await getLogsByProtocolId(protocolId),
  })

  const newLogMutation = useMutation({
    mutationFn: async (message: string) => {
      if (message.length > 0) {
        await newLog({
          protocolId,
          userId,
          // @ts-ignore
          message: message,
        })
        refetch()
      }
    },
  })

  const form = useForm({
    initialValues: {
      logMessage: '',
    },
  })

  return (
    <>
      {context_menu && (
        <BadgeButton
          className="flex grow justify-between shadow-sm"
          onClick={() => {
            refetch()
            setOpened(true)
          }}
        >
          Ver logs <Note size={18} />
        </BadgeButton>
      )}
      <div className="group pointer-events-none relative">
        {!context_menu && (
          <button
            onClick={() => {
              refetch()
              setOpened(true)
            }}
            className="pointer-events-auto -ml-3 mt-1"
            aria-label="Ver o agregar logs"
          >
            <Note className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>
      <CustomDrawer title="Logs" open={opened} onClose={setOpened}>
        {logs && logs.length > 0 ?
          logs!.map((log) => (
            <div key={log.id} className="text-black/70">
              <div className="flex justify-between">
                <Subheading className="text-sm font-medium">
                  {log.user.name}
                </Subheading>
                <Text className="!text-xs font-light">
                  {dateFormatter.format(log.createdAt)}
                </Text>
              </div>
              <Text className="border-l-1 pl-3 text-xs">
                {log.message.replace('-->', ' a ')}
              </Text>
            </div>
          ))
        : <Text className="text-center text-sm text-black/60 dark:text-gray-300">
            No hay cambios de estado ni observaciones
          </Text>
        }

        <Divider />
        <form
          onSubmit={form.onSubmit(() => {
            newLogMutation.mutate(form.getValues().logMessage)
          })}
        >
          <Fieldset>
            {' '}
            <FormTextarea
              label="Agregar observación"
              {...form.getInputProps('logMessage')}
            />
          </Fieldset>
          <FormActions>
            {' '}
            <FormButton isLoading={false}>Guardar observación</FormButton>
          </FormActions>
        </form>
      </CustomDrawer>
    </>
  )
}
