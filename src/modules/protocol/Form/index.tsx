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
import { protocol } from '@prisma/client'
import { useState } from 'react'
import { zodResolver } from '@mantine/form'
import protocolSchema from 'utils/zod/protocolSchema'

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

export default function ProtocolForm({ protocol }: { protocol: protocol }) {
    const [currentVisible, setVisible] = useState<number>(0)
    const notifications = useNotifications()

    const form = useProtocol({
        initialValues: protocol,
        validate: zodResolver(protocolSchema),
        validateInputOnChange: true,
    })

    const updateProtocol = async (protocol: protocol) => {
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
    }

    return (
        <div className="mx-auto flex w-full flex-col">
            <div className="flex h-6 w-full items-center justify-center gap-16 p-5">
                {/* {sectionMapper.map(({ key }) => (
                    <button
                        key={key}
                        className={`h-3 w-3 cursor-pointer rounded-full bg-primary-100 transition-all duration-200 ${
                            currentVisible == key
                                ? 'h-4 w-4 bg-primary'
                                : Number(currentVisible) > Number(key)
                                ? 'h-3 w-3 bg-primary/80'
                                : ''
                        }`}
                        onClick={() => setVisible(key)}
                    ></button>
                ))} */}
            </div>
            <div className="flex-1">
                <ProtocolProvider form={form}>
                    {sectionMapper[currentVisible]}
                </ProtocolProvider>
            </div>

            <div className="mt-12 mb-8 flex w-full justify-between px-10 ">
                <Button
                    intent="secondary"
                    disabled={currentVisible === 0}
                    onClick={() => setVisible((prev) => prev - 1)}
                >
                    <ChevronLeft className="h-5" />
                </Button>

                <Button
                    onClick={() => updateProtocol(form.values)}
                    intent="secondary"
                >
                    Guardar
                </Button>
                <Button
                    intent="secondary"
                    disabled={currentVisible === 7}
                    onClick={() => setVisible((prev) => prev + 1)}
                >
                    <ChevronRight className="h-5" />
                </Button>
            </div>
        </div>
    )
}
