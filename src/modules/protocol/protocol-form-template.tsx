'use client'
import { Button } from '@elements/button'
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
import type { Protocol as ProtocolZod } from '@utils/zod'
import { ProtocolSchema } from '@utils/zod'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    CircleCheck,
    CircleDashed,
} from 'tabler-icons-react'
import { ProtocolProvider, useProtocol } from 'utils/createContext'
import InfoTooltip from './elements/tooltip'
import { cx } from '@utils/cx'

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

export default function ProtocolForm({ protocol }: { protocol: ProtocolZod }) {
    const router = useRouter()
    const path = usePathname()
    const [section, setSection] = useState(path?.split('/')[3])

    const [isPending, startTransition] = useTransition()

    const form = useProtocol({
        initialValues:
            path?.split('/')[2] === 'new' &&
            localStorage.getItem('temp-protocol')
                ? JSON.parse(localStorage.getItem('temp-protocol')!)
                : protocol,
        validate: zodResolver(ProtocolSchema),
        validateInputOnBlur: true,
    })

    useEffect(() => {
        // Validate if not existing path goes to section 0
        if (
            path &&
            !['0', '1', '2', '3', '4', '5', '6', '7'].includes(
                path?.split('/')[3]
            )
        )
            router.push('/protocols/' + path?.split('/')[2] + '/0')
    }, [path, router])

    const upsertProtocol = useCallback(
        async (protocol: ProtocolZod) => {
            // flow for protocols that don't have ID
            if (!protocol.id) {
                const res = await fetch(`/api/protocol`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(protocol),
                })
                const { id }: Protocol = await res.json()

                if (res.status === 200) {
                    notifications.show({
                        title: 'Protocolo creado',
                        message: 'El protocolo ha sido creado con éxito',
                        intent: 'success',
                    })
                }
                return router.push(`/protocols/${id}/${section}`)
            }
            const res = await fetch(`/api/protocol/${protocol.id}`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(protocol),
            })

            if (res.status === 200) {
                notifications.show({
                    title: 'Protocolo guardado',
                    message: 'El protocolo ha sido guardado con éxito',
                    intent: 'success',
                })
                startTransition(() => {
                    router.refresh()
                })
            }
        },
        [router, section]
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
            <Button
                intent="outline"
                className={cx(
                    'px-2 py-1 text-xs font-medium',
                    section === value && 'font-bold shadow',
                    !form.isValid(path) && section !== value ? 'opacity-50' : ''
                )}
                onClick={() => setSection(value)}
            >
                {label}

                {!form.isValid(path) ? (
                    form.isDirty(path) ? (
                        <AlertCircle className="h-4 w-4 stroke-warning-500/80" />
                    ) : (
                        <CircleDashed className="h-4 w-4 stroke-gray-500/80" />
                    )
                ) : (
                    <CircleCheck className="h-4 w-4 stroke-success-500/80" />
                )}
            </Button>
        ),
        [form, section]
    )

    return (
        <ProtocolProvider form={form}>
            <form
                onBlur={() => {
                    path?.split('/')[2] === 'new' &&
                    typeof window !== 'undefined'
                        ? localStorage.setItem(
                              'temp-protocol',
                              JSON.stringify(form.values)
                          )
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
                    typeof window !== 'undefined'
                        ? localStorage.removeItem('temp-protocol')
                        : null
                    upsertProtocol(form.values)
                }}
                className="w-full px-4 py-4"
            >
                <InfoTooltip>
                    <h4>Indicadores de sección</h4>
                    <p>
                        <CircleCheck className="mr-2 inline h-4 w-4 stroke-success-500 stroke-2" />
                        Indica que la sección se encuentra completada y sin
                        errores. Cuando todas las secciones tengan este
                        indicador, se permite publicar un protocolo.
                    </p>
                    <p>
                        <AlertCircle className="mr-2 inline h-4 w-4 stroke-warning-500 stroke-2" />
                        Indica que la sección fue modificada pero necesita ser
                        completada correctamente, falta algún campo obligatorio
                        o tiene algún error.
                    </p>
                    <p>
                        <CircleDashed className="mr-2 inline h-4 w-4 stroke-gray-500 opacity-40" />
                        Si la sección se encuentra con menor opacidad, es porque
                        no fue modificada en la session activa, pero se
                        encuentra incompleta.
                    </p>
                </InfoTooltip>
                <motion.div
                    initial={{ opacity: 0, y: -7 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="mx-auto mb-6 flex w-fit max-w-full gap-1 overflow-auto rounded border bg-gray-50 p-1"
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

                <div className="mb-8 mt-12 flex w-full justify-between">
                    <Button
                        type="button"
                        intent="outline"
                        disabled={section === '0'}
                        onClick={() =>
                            setSection((p) => (Number(p) - 1).toString())
                        }
                    >
                        <ChevronLeft className="h-4 text-gray-500" />
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            intent="secondary"
                            loading={isPending}
                        >
                            Guardar
                        </Button>
                    </div>
                    <Button
                        type="button"
                        intent="outline"
                        disabled={section === '7'}
                        onClick={() =>
                            setSection((p) => (Number(p) + 1).toString())
                        }
                    >
                        <ChevronRight className="h-4 text-gray-500" />
                    </Button>
                </div>
            </form>
        </ProtocolProvider>
    )
}
