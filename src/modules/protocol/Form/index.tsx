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
import { Check, X, ChevronLeft, ChevronRight } from 'tabler-icons-react'
import { useNotifications } from '@mantine/notifications'
import { Button } from '@elements/Button'
import { useCallback, useState } from 'react'
import { zodResolver } from '@mantine/form'
import { Protocol, ProtocolSchema } from '@utils/zod'
import { protocol } from '@prisma/client'

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

export default function ProtocolForm({ protocol }: { protocol: Protocol }) {
    const [currentVisible, setVisible] = useState<number>(0)
    const notifications = useNotifications()

    const form = useProtocol({
        initialValues: protocol,
        validate: zodResolver(ProtocolSchema),
        validateInputOnChange: true,
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

    return (
        <ProtocolProvider form={form}>
            <form
                onSubmit={form.onSubmit(
                    (values) => upsertProtocol(values),
                    (errors) => console.log(errors)
                )}
                className="mx-auto flex w-full flex-col"
            >
                <div className="flex h-6 w-full items-center justify-center gap-16 p-5">
                    {Object.keys(sectionMapper).map((key: string) => (
                        <button
                            type="button"
                            key={key}
                            className={`h-3 w-3 cursor-pointer rounded-full bg-primary-100 transition-all duration-200 ${
                                currentVisible == Number(key)
                                    ? 'h-4 w-4 bg-primary'
                                    : Number(currentVisible) > Number(key)
                                    ? 'h-3 w-3 bg-primary/80'
                                    : 'border'
                            }`}
                            onClick={() => setVisible(Number(key))}
                        ></button>
                    ))}
                </div>
                <div className="flex-1">{sectionMapper[currentVisible]}</div>

                <div className="mt-12 mb-8 flex w-full justify-between px-10 ">
                    <Button
                        type="button"
                        intent="secondary"
                        disabled={currentVisible === 0}
                        onClick={() => setVisible((prev) => prev - 1)}
                    >
                        <ChevronLeft className="h-5" />
                    </Button>

                    <Button type="submit" intent="secondary">
                        Guardar
                    </Button>
                    <Button
                        type="button"
                        intent="secondary"
                        disabled={currentVisible === 7}
                        onClick={() => setVisible((prev) => prev + 1)}
                    >
                        <ChevronRight className="h-5" />
                    </Button>
                </div>
            </form>
        </ProtocolProvider>
    )
}
