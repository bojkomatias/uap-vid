'use client'

import { notifications } from '@elements/notifications'
import { zodResolver } from '@mantine/form'
import type { Protocol } from '@prisma/client'
import {
  BibliographyForm,
  BudgetForm,
  DescriptionForm,
  DurationForm,
  IdentificationForm,
  IntroductionForm,
  MethodologyForm,
  PublicationForm,
} from '@protocol/form-sections'
import { ProtocolSchema } from '@utils/zod'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import {
  AlertCircle,
  ArrowNarrowLeft,
  ArrowNarrowRight,
  CircleCheck,
  CircleDashed,
} from 'tabler-icons-react'
import { ProtocolProvider, useProtocol } from 'utils/createContext'
import InfoTooltip from './elements/tooltip'
import { cx } from '@utils/cx'
import { BadgeButton } from '@components/badge'
import { FormButton } from '@shared/form/form-button'
import { Button } from '@components/button'
import type { z } from 'zod'
import { createProtocol, updateProtocolById } from '@repositories/protocol'

const sectionMapper: { [key: number]: JSX.Element } = {
  0: <IdentificationForm />,
  1: <DurationForm />,
  2: <BudgetForm />,
  3: <DescriptionForm />,
  4: <IntroductionForm />,
  5: <MethodologyForm />,
  6: <PublicationForm />,
  7: <BibliographyForm />,
}

export default function ProtocolForm({
  protocol,
}: {
  protocol: z.infer<typeof ProtocolSchema>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [section, setSection] = useState(pathname?.split('/')[3])

  const [isPending, startTransition] = useTransition()

  const form = useProtocol({
    initialValues:
      (
        pathname?.split('/')[2] === 'new' &&
        typeof window !== 'undefined' &&
        localStorage.getItem('temp-protocol')
      ) ?
        JSON.parse(localStorage.getItem('temp-protocol')!)
      : protocol,
    validate: zodResolver(ProtocolSchema),
    validateInputOnBlur: true,
  })

  useEffect(() => {
    // Validate if not existing path goes to section 0
    if (
      pathname &&
      !['0', '1', '2', '3', '4', '5', '6', '7'].includes(
        pathname?.split('/')[3]
      )
    )
      router.push('/protocols/' + pathname?.split('/')[2] + '/0')
  }, [pathname, router])

  const upsertProtocol = useCallback(
    async (protocol: z.infer<typeof ProtocolSchema>) => {
      const { id, ...restOfProtocol } = protocol

      // flow for protocols that don't have ID
      if (!id) {
        const created = await createProtocol(restOfProtocol as Protocol) // Its because enum from zod != prisma enum according to types

        if (created) {
          notifications.show({
            title: 'Protocolo creado',
            message: 'El protocolo ha sido creado con éxito',
            intent: 'success',
          })

          // Only when created remove from LocalStorage
          localStorage.removeItem('temp-protocol')

          return startTransition(() => {
            router.push(`/protocols/${created.id}`)
          })
        }
        return notifications.show({
          title: 'Error al crear',
          message: 'Hubo un error al crear el protocolo',
          intent: 'error',
        })
      }

      const updated = await updateProtocolById(id, restOfProtocol as Protocol)

      if (updated) {
        notifications.show({
          title: 'Protocolo guardado',
          message: 'El protocolo ha sido guardado con éxito',
          intent: 'success',
        })
        return startTransition(() => {
          router.push(`/protocols/${protocol.id}`)
        })
      }
      return notifications.show({
        title: 'Error al guardar',
        message: 'Hubo un error al guardar el protocolo',
        intent: 'error',
      })
    },
    [router]
  )

  const SectionButton = useCallback(
    ({
      path,
      label,
      value,
    }: {
      path: string
      label: string
      value: string
    }) => (
      <BadgeButton
        color="light"
        className={cx(
          'opacity-70',
          section == value && 'font-semibold opacity-100'
        )}
        onClick={() => {
          startTransition(() => {
            setSection(value)
          })
        }}
      >
        {label}

        {!form.isValid(path) ?
          form.isDirty(path) ?
            <AlertCircle className="size-4 stroke-yellow-500" />
          : <CircleDashed className="size-3.5 stroke-gray-500" />
        : <CircleCheck className="size-4 stroke-teal-500" />}
      </BadgeButton>
    ),
    [form, section]
  )

  return (
    <ProtocolProvider form={form}>
      <form
        onBlur={() => {
          pathname?.split('/')[2] === 'new' && typeof window !== 'undefined' ?
            localStorage.setItem('temp-protocol', JSON.stringify(form.values))
          : null
        }}
        onSubmit={(e) => {
          e.preventDefault()
          // Enforce validity only on first section to Save
          if (!form.isValid('sections.identification')) {
            notifications.show({
              title: 'No se pudo guardar',
              message:
                'Debes completar la sección "Identificación" para poder guardar un borrador',
              intent: 'error',
            })
            return form.validate()
          }

          upsertProtocol(form.values)
        }}
      >
        <InfoTooltip>
          <h4>Indicadores de sección</h4>
          <p>
            <CircleCheck className="mr-2 inline h-4 w-4 stroke-teal-500 stroke-2" />
            Indica que la sección se encuentra completada y sin errores. Cuando
            todas las secciones tengan este indicador, se permite publicar un
            protocolo.
          </p>
          <p>
            <AlertCircle className="mr-2 inline h-4 w-4 stroke-yellow-500 stroke-2" />
            Indica que la sección fue modificada pero necesita ser completada
            correctamente, falta algún campo obligatorio o tiene algún error.
          </p>
          <p>
            <CircleDashed className="mr-2 inline h-4 w-4 stroke-gray-500 opacity-40" />
            Si la sección se encuentra con menor opacidad, es porque no fue
            modificada en la session activa, pero se encuentra incompleta.
          </p>
        </InfoTooltip>
        <motion.div
          initial={{ opacity: 0, y: -7 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mx-auto mt-2 flex w-fit flex-wrap items-center justify-center gap-0.5 rounded-lg border border-black/5 p-0.5 dark:border-white/5"
        >
          <SectionButton
            path={'sections.identification'}
            label={'Identificación'}
            value={'0'}
          />
          <SectionButton
            path={'sections.duration'}
            label={'Duración'}
            value={'1'}
          />
          <SectionButton
            path={'sections.budget'}
            label={'Presupuesto'}
            value={'2'}
          />
          <SectionButton
            path={'sections.description'}
            label={'Descripción'}
            value={'3'}
          />
          <SectionButton
            path={'sections.introduction'}
            label={'Introducción'}
            value={'4'}
          />
          <SectionButton
            path={'sections.methodology'}
            label={'Metodología'}
            value={'5'}
          />

          <SectionButton
            path={'sections.publication'}
            label={'Publicación'}
            value={'6'}
          />

          <SectionButton
            path={'sections.bibliography'}
            label={'Bibliografía'}
            value={'7'}
          />
        </motion.div>

        {sectionMapper[Number(section)]}

        <div className="mt-12 flex w-full justify-between">
          <Button
            type="button"
            plain
            disabled={section === '0'}
            onClick={() => setSection((p) => (Number(p) - 1).toString())}
          >
            <ArrowNarrowLeft data-slot="icon" />
            Sección previa
          </Button>

          <FormButton isLoading={isPending}>Guardar</FormButton>

          <Button
            type="button"
            plain
            disabled={section === '7'}
            onClick={() => setSection((p) => (Number(p) + 1).toString())}
          >
            Sección siguiente
            <ArrowNarrowRight data-slot="icon" />
          </Button>
        </div>
      </form>
    </ProtocolProvider>
  )
}
