'use client'

import {
    Protocol,
    ProtocolProvider,
    useProtocol,
    validate,
} from 'config/createContext'
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

const sectionMapper = [
    <Identification key="0" id="0" />,
    <Duration key="1" id="1" />,
    <DirectBudget key="2" id="2" />,
    <Description key="3" id="3" />,
    <Introduction key="4" id="4" />,
    <Method key="5" id="5" />,
    <Publication key="6" id="6" />,
    <Bibliography key="7" id="7" />,
]

export default function ProtocolForm({ protocol }: { protocol: protocol }) {
    const [currentVisible, setVisible] = useState<any>('0')
    const notifications = useNotifications()

    const form = useProtocol({
        initialValues: protocol,
        validate: validate,
        validateInputOnChange: true,
    })

    const updateProtocol = async (protocol: Protocol) => {
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
                {sectionMapper.map(({ key }) => (
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
                ))}
            </div>
            <div className="flex-1">
                <ProtocolProvider form={form}>
                    {sectionMapper.map((section) =>
                        section.key == currentVisible ? section : null
                    )}
                </ProtocolProvider>
            </div>

            <div className="mt-12 mb-8 flex w-full justify-between px-10 ">
                <Button
                    disabled={currentVisible === '0'}
                    onClick={() =>
                        setVisible((prev: string) => String(Number(prev) - 1))
                    }
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                    onClick={() => updateProtocol(form.values)}
                    className=""
                >
                    Guardar
                </Button>
                <Button
                    disabled={currentVisible === '7'}
                    onClick={() =>
                        setVisible((prev: string) => String(Number(prev) + 1))
                    }
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </div>
    )
}
