'use client'
import { ProtocolProvider, useProtocol } from 'utils/createContext'
import Identification from './Sections/Identification'
import Duration from './Sections/Duration'
import DirectBudget from './Sections/DirectBudget'
import Description from './Sections/Description'
import Introduction from './Sections/Introduction'
import Method from './Sections/Method'
import Publication from './Sections/Publication'
import Bibliography from './Sections/Bibliography'
import { Check, ChevronLeft, ChevronRight, X } from 'tabler-icons-react'
import { useNotifications } from '@mantine/notifications'
import { Button } from '@elements/Button'
import { useCallback, useEffect, useState } from 'react'
import { UseFormReturnType, zodResolver } from '@mantine/form'
import { Protocol as ProtocolZod, ProtocolSchema } from '@utils/zod'
import { Protocol } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { SegmentedControl } from '@mantine/core'
import { motion } from 'framer-motion'

const sectionMapper: { [key: number]: JSX.Element } = {
    0: <Identification />,
    1: <Duration />,
    2: <DirectBudget />,
    3: <Description />,
    4: <Introduction />,
    5: <Method />,
    6: <Publication />,
    7: <Bibliography />,
}

export default function ProtocolForm({ protocol }: { protocol: ProtocolZod }) {
    const router = useRouter()
    const path = usePathname()
    const [section, setSection] = useState(path?.split('/')[3])
    const notifications = useNotifications()

    const form = useProtocol({
        initialValues:
            localStorage.getItem('temp-protocol') === null
                ? protocol
                : JSON.parse(localStorage.getItem('temp-protocol') as string),
        validate: zodResolver(ProtocolSchema),
        validateInputOnChange: true,
    })

    useEffect(() => {
        // Validate if not existing path goes to section 0
        if (
            !['0', '1', '2', '3', '4', '5', '6', '7'].includes(
                path?.split('/')[3]!
            )
        )
            router.push('/protocols/' + path?.split('/')[2] + '/0')
    }, [path])

    const upsertProtocol = useCallback(async (protocol: ProtocolZod) => {
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
                notifications.showNotification({
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
            notifications.showNotification({
                title: 'Protocolo guardado',
                message: 'El protocolo ha sido guardado con éxito',
                color: 'teal',
                icon: <Check />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
        }
    }, [])

    return (
        <ProtocolProvider form={form}>
            <form
                onChange={() => {
                    typeof window !== 'undefined'
                        ? localStorage.setItem(
                              'temp-protocol',
                              JSON.stringify(form.values)
                          )
                        : null
                }}
                onBlur={() => {
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
                    if (!form.isValid('sections.identification'))
                        notifications.showNotification({
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
                    typeof window !== 'undefined'
                        ? localStorage.removeItem('temp-protocol')
                        : null
                    upsertProtocol(form.values)
                }}
                className="mx-auto w-full max-w-7xl px-4"
            >
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="my-6  w-full py-2 lg:mx-auto lg:w-fit"
                >
                    <SegmentedControl
                        value={section}
                        onChange={setSection}
                        data={[
                            { label: 'Identificación', value: '0' },
                            { label: 'Duración', value: '1' },
                            { label: 'Presupuesto', value: '2' },
                            { label: 'Descripción', value: '3' },
                            { label: 'Introducción', value: '4' },
                            { label: 'Metodología', value: '5' },
                            { label: 'Publicación', value: '6' },
                            { label: 'Bibliografía', value: '7' },
                        ]}
                        classNames={{
                            root: 'bg-gray-50 border rounded',
                            label: 'uppercase text-xs px-2 py-1 font-light',
                            indicator: 'bg-primary font-semibold',
                        }}
                        color="blue"
                        transitionDuration={300}
                    />
                </motion.div>

                {sectionMapper[Number(section)]}

                <div className="mt-12 mb-8 flex w-full justify-between">
                    <Button
                        type="button"
                        intent="secondary"
                        disabled={section === '0'}
                        onClick={() =>
                            setSection((p) => (Number(p) - 1).toString())
                        }
                    >
                        <ChevronLeft className="h-5" />
                    </Button>

                    <div className="flex gap-2">
                        <Button type="submit" intent="secondary">
                            Guardar
                        </Button>
                    </div>
                    <Button
                        type="button"
                        intent="secondary"
                        disabled={section === '7'}
                        onClick={() =>
                            setSection((p) => (Number(p) + 1).toString())
                        }
                    >
                        <ChevronRight className="h-5" />
                    </Button>
                </div>
            </form>
        </ProtocolProvider>
    )
}
