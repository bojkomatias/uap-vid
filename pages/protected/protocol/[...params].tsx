import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
    Protocol,
    ProtocolProvider,
    useProtocol,
} from '../../../config/createContext'

import Identification from '../../../components/Sections/Identification'
import Duration from '../../../components/Sections/Duration'
import DirectBudget from '../../../components/Sections/DirectBudget'
import Description from '../../../components/Sections/Description'
import Introduction from '../../../components/Sections/Introduction'
import Method from '../../../components/Sections/Method'
import Publication from '../../../components/Sections/Publication'
import Bibliography from '../../../components/Sections/Bibliography'
import { GetServerSideProps } from 'next'
import { Button } from '../../../components/Atomic/Button'
import Modal from '../../../components/Atomic/Modal'
import { ExclamationCircleIcon } from '@heroicons/react/outline'

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

export default function ProtocolPage({ protocol }: { protocol: Protocol }) {
    const router = useRouter()
    const [savedEvent, setSavedEvent] = useState(false)
    const [currentVisible, setVisible] = useState<any>('0')

    const timeout = useRef(false)
    const first = useRef(true)

    const form = useProtocol({
        initialValues: protocol,
    })

    useEffect(() => {
        const warningText =
            'La pagina tiene cambios sin guardar, desea continuar de todos modos?'
        const handleWindowClose = (e: BeforeUnloadEvent) => {
            if (form.values == protocol) return
            e.preventDefault()
            return (e.returnValue = warningText)
        }
        const handleBrowseAway = () => {
            if (form.values == protocol) return
            if (window.confirm(warningText)) return
            router.events.emit('routeChangeError')
            throw 'routeChange aborted.'
        }
        window.addEventListener('beforeunload', handleWindowClose)
        router.events.on('routeChangeStart', handleBrowseAway)
        return () => {
            window.removeEventListener('beforeunload', handleWindowClose)
            router.events.off('routeChangeStart', handleBrowseAway)
        }
    }, [form.values])

    const updateProtocol = async (protocol: Protocol) => {
        const res = await fetch(`/api/protocol/${protocol._id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(protocol),
        })
        console.log(res)
        setSavedEvent(true)
        setTimeout(() => {
            setSavedEvent(false)
        }, 3000)
    }

    return (
        <>
            <div className="-translate-y-12 text-4xl font-bold text-primary">
                Protocolo de investigación{' '}
                <span
                    className={
                        savedEvent
                            ? 'opacity-1 ml-2 text-sm transition-all duration-150'
                            : 'ml-2 text-sm opacity-0 transition-all duration-150'
                    }
                >
                    Se han guardado los datos automáticamente en la base de
                    datos
                </span>
            </div>
            <div className="flex min-h-[80vh] w-full flex-col">
                <div className="-mt-2 mb-6 flex h-6 w-full justify-evenly">
                    {sectionMapper.map(({ key }) => (
                        <button
                            key={key}
                            className={`h-3 w-3 cursor-pointer rounded-full bg-primary-100 transition-all duration-200 ${
                                currentVisible == key
                                    ? 'h-4 w-4 bg-primary'
                                    : ''
                            }`}
                            onClick={() => setVisible(key)}
                        ></button>
                    ))}
                </div>
                <div className="flex-1">
                    <ProtocolProvider form={form}>
                        {/* Lit todos los fields */}
                        {sectionMapper.map((section) =>
                            section.key == currentVisible ? section : null
                        )}
                    </ProtocolProvider>
                </div>

                <Button className="align-self-end mt-12 mb-8">Guardar</Button>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const [protocolId] = ctx.params?.params as string[]
    const string = `${process.env.NEXTURL}/api/protocol/${protocolId}`
    const data = await fetch(string).then((res) => res.json())

    return {
        props: { protocol: data },
    }
}
