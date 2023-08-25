'use client'
import { ProtocolProvider, useProtocol } from 'utils/createContext'
import {
    AlertCircle,
    Check,
    ChevronLeft,
    ChevronRight,
    CircleCheck,
    CircleDashed,
    X,
} from 'tabler-icons-react'
import { notifications } from '@mantine/notifications'
import { Button } from '@elements/button'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { zodResolver } from '@mantine/form'
import type { Protocol as ProtocolZod } from '@utils/zod'
import { ProtocolSchema } from '@utils/zod'
import type { Protocol } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { SegmentedControl } from '@mantine/core'
import { motion } from 'framer-motion'
import {
    IdentificationForm,
    DurationForm,
    BudgetForm,
    DescriptionForm,
    IntroductionForm,
    MethodologyForm,
    PublicationForm,
    BibliographyForm,
} from '@protocol/form-sections'
import InfoTooltip from './elements/tooltip'

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
        validateInputOnChange: true,
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
                        color: 'teal',
                        icon: <Check />,
                        radius: 0,
                        style: {
                            marginBottom: '.8rem',
                        },
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
                    color: 'teal',
                    icon: <Check />,
                    radius: 0,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
                startTransition(() => {
                    router.refresh()
                })
            }
        },
        [router, section]
    )

    const SegmentLabel = useCallback(
        ({
            path,
            label,
            value,
        }: {
            path: string
            label: string
            value: string
        }) => (
            <>
                <span
                    className={
                        !form.isValid(path) && section !== value
                            ? 'opacity-50'
                            : ''
                    }
                >
                    {label}
                </span>
                {!form.isValid(path) ? (
                    form.isDirty(path) ? (
                        <AlertCircle className="h-4 w-4 stroke-warning-500/80" />
                    ) : (
                        <CircleDashed className="h-4 w-4 stroke-gray-500/80" />
                    )
                ) : (
                    <CircleCheck className="h-4 w-4 stroke-success-500/80" />
                )}
            </>
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
                            color: 'red',
                            icon: <X />,
                            radius: 0,
                            style: {
                                marginBottom: '.8rem',
                            },
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
                    className="mx-auto mb-6 w-fit max-w-full overflow-auto py-2"
                >
                    <SegmentedControl
                        value={section}
                        onChange={setSection}
                        data={[
                            {
                                label: (
                                    <SegmentLabel
                                        path={'sections.identification'}
                                        label={'Identificación'}
                                        value={'0'}
                                    />
                                ),
                                value: '0',
                            },
                            {
                                label: (
                                    <SegmentLabel
                                        path={'sections.duration'}
                                        label={'Duración'}
                                        value={'1'}
                                    />
                                ),
                                value: '1',
                            },
                            {
                                label: (
                                    <SegmentLabel
                                        path={'sections.budget'}
                                        label={'Presupuesto'}
                                        value={'2'}
                                    />
                                ),
                                value: '2',
                            },
                            {
                                label: (
                                    <SegmentLabel
                                        path={'sections.description'}
                                        label={'Descripción'}
                                        value={'3'}
                                    />
                                ),
                                value: '3',
                            },
                            {
                                label: (
                                    <SegmentLabel
                                        path={'sections.introduction'}
                                        label={'Introducción'}
                                        value={'4'}
                                    />
                                ),
                                value: '4',
                            },
                            {
                                label: (
                                    <SegmentLabel
                                        path={'sections.methodology'}
                                        label={'Metodología'}
                                        value={'5'}
                                    />
                                ),
                                value: '5',
                            },
                            {
                                label: (
                                    <SegmentLabel
                                        path={'sections.publication'}
                                        label={'Publicación'}
                                        value={'6'}
                                    />
                                ),
                                value: '6',
                            },
                            {
                                label: (
                                    <SegmentLabel
                                        path={'sections.bibliography'}
                                        label={'Bibliografía'}
                                        value={'7'}
                                    />
                                ),
                                value: '7',
                            },
                        ]}
                        classNames={{
                            root: 'bg-gray-50 border rounded divide-x-0 gap-1',
                            label: 'inline-flex items-center gap-2 px-2 py-1 text-xs font-semibold text-gray-600',
                            indicator: 'rounded-md ring-1 ring-inset',
                        }}
                        transitionDuration={300}
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
