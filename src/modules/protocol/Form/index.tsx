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
import { useCallback, useState } from 'react'
import { zodResolver } from '@mantine/form'
import { Protocol, ProtocolSchema } from '@utils/zod'
import { protocol } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'

const sectionMapper: { [key: number]: JSX.Element } = {
    0: <Identification key="Identification" />,
    1: <Duration key="Duration" />,
    2: <DirectBudget key="Identification" />,
    3: <Description key="Identification" />,
    4: <Introduction key="Identification" />,
    5: <Method key="Identification" />,
    6: <Publication key="Identification" />,
    7: <Bibliography key="Identification" />,
}

export default function ProtocolForm({
    protocol,
    currentSection,
}: {
    protocol: Protocol
    currentSection: number
}) {
    const router = useRouter()
    const path = usePathname()
    console.log(path?.slice(-1))
    const [currentVisible, setVisible] = useState<number>(currentSection)
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
                <div className="flex h-3 py-8 w-full items-center justify-center gap-6 sm:gap-12 md:gap-16 lg:gap-20">
                    {Object.entries(sectionMapper).map(([key, value]) => (
                        <button
                            type="button"
                            key={key}
                            className={`cursor-pointer rounded-full bg-primary-100 transition duration-200 ${
                                currentVisible == Number(key)
                                    ? 'h-3 w-3 bg-primary'
                                    : Number(currentVisible) > Number(key)
                                    ? 'h-2 w-2 bg-gray-400'
                                    : 'border h-2 w-2'
                            }`}
                            onClick={() => setVisible(Number(key))}
                        ></button>
                    ))}
                </div>

                <div className="flex-1">{sectionMapper[currentVisible]}</div>

                <div className="mt-12 mb-8 flex w-full justify-between">
                    <Button
                        type="button"
                        intent="secondary"
                        disabled={currentVisible === 0}
                        onClick={() => setVisible((prev) => prev - 1)}
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
                        onClick={() => setVisible((prev) => prev + 1)}
                    >
                        <ChevronRight className="h-5" />
                    </Button>
                </div>
            </form>
        </ProtocolProvider>
    )
}
