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
import { Check, ChevronLeft, ChevronRight } from 'tabler-icons-react'
import { useNotifications } from '@mantine/notifications'
import { Button } from '@elements/Button'
import { useCallback } from 'react'
import { zodResolver } from '@mantine/form'
import { Protocol, ProtocolSchema } from '@utils/zod'
import { protocol } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'

const sectionMapper: { [key: number]: JSX.Element } = {
    0: <Identification key="Identificación" />,
    1: <Duration key="Duración" />,
    2: <DirectBudget key="Presupuesto" />,
    3: <Description key="Descripción" />,
    4: <Introduction key="Introducción" />,
    5: <Method key="Método" />,
    6: <Publication key="Publicación" />,
    7: <Bibliography key="Bibliografía" />,
}

export default function ProtocolForm({ protocol }: { protocol: Protocol }) {
    const router = useRouter()
    const path = usePathname()
    const notifications = useNotifications()
    const form = useProtocol({
        initialValues: protocol,
        validate: zodResolver(ProtocolSchema),
        validateInputOnBlur: true,
    })

    const upsertProtocol = useCallback(async (protocol: Protocol) => {
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
            const { id, createdAt }: protocol = await res.json()
            form.setValues({ id, createdAt })

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
            return
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

    const currentVisible = Number(path?.split('/')[3])
    const pushTo = (int: number) =>
        router.push('/protocols/' + path?.split('/')[2] + '/' + int.toString())

    return (
        <ProtocolProvider form={form}>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    // Enforce validity only on first section to Save
                    if (!form.isValid('sections.identification'))
                        return console.log(form.errors)
                    upsertProtocol(form.values)
                }}
                className="mx-auto flex max-w-7xl flex-col"
            >
                <div className="w-full overflow-x-auto relative">
                    <div className="flex gap-1 items-center md:gap-3 w-fit py-4 mx-auto px-1">
                        {Object.entries(sectionMapper).map(([key, value]) => (
                            <button
                                type="button"
                                key={key}
                                className={clsx(
                                    'cursor-pointer uppercase rounded px-3 py-1 hover:ring-1 hover:ring-offset-1 hover:ring-primary',
                                    currentVisible == Number(key)
                                        ? 'text-white bg-primary font-bold text-xs'
                                        : // : Number(currentVisible) > Number(key)
                                          // ? 'h-2 w-2 bg-gray-400'
                                          'font-light bg-gray-100 text-gray-500 hover:text-black text-[0.6rem]'
                                )}
                                onClick={() => pushTo(Number(key))}
                            >
                                {value.key}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1">{sectionMapper[currentVisible]}</div>

                <div className="mt-12 mb-8 flex w-full justify-between">
                    <Button
                        type="button"
                        intent="secondary"
                        disabled={currentVisible === 0}
                        onClick={() => pushTo(currentVisible - 1)}
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
                        disabled={currentVisible === 7}
                        onClick={() => pushTo(currentVisible + 1)}
                    >
                        <ChevronRight className="h-5" />
                    </Button>
                </div>
            </form>
        </ProtocolProvider>
    )
}
