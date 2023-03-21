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
import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@mantine/form'
import { Protocol, ProtocolSchema } from '@utils/zod'
import { protocol } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { SegmentedControl } from '@mantine/core'

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
    const router = useRouter()
    const path = usePathname()
    const [section, setSection] = useState(path?.split('/')[3])
    const notifications = useNotifications()
    const form = useProtocol({
        initialValues: protocol,
        validate: zodResolver(ProtocolSchema),
        validateInputOnBlur: true,
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
                <div className="w-full overflow-x-auto my-6 py-2 lg:w-fit lg:mx-auto">
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
                            active: 'bg-primary',
                            labelActive:
                                'text-white hover:text-white font-semibold',
                        }}
                        transitionDuration={300}
                    />
                </div>

                <div className="flex-1">{sectionMapper[Number(section)]}</div>

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
