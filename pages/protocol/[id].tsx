import { ReactElement, useEffect, useRef, useState } from 'react'
import { Fragment } from 'react'
import { Popover } from '@headlessui/react'
import { Form } from '../../components/Protocol/Form'
import { Protocol, Section } from '../../config/types'
import Stepper from '../../components/Protocol/Stepper'
import { Button } from '../../components/Atomic/Button'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'

export default function ProtocolPage({
    serverProtocol,
}: {
    serverProtocol: Protocol
}) {
    const router = useRouter()
    const [protocol, setProtocol] = useState(serverProtocol)
    const [currentSection, setCurrentSection] = useState<Section>(
        protocol.data[0]
    )
    // const [debouncedProtocol] = useDebouncedValue(protocol, 200)

    useEffect((): any => {
        const updateProtocol = async (protocol: Protocol) => {
            const res = await fetch(`/api/protocol/${router.query.id}`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(protocol),
            })
            console.log('Pegue a la api', await res.json())
        }
        updateProtocol(protocol)
    }, [protocol, router.query.id])

    return (
        <>
            <div className="-translate-y-8 text-4xl font-bold text-primary">
                Protocolo de investigación
            </div>{' '}
            <div className="flex h-full -translate-y-8 flex-col">
                <Stepper currentSection={currentSection} />
                <Form
                    protocol={protocol}
                    section={currentSection}
                    updateProtocol={setProtocol}
                />
                <div className="flex w-full justify-between px-8">
                    <Button
                        disabled={currentSection?.sectionId === 1}
                        onClick={() => {
                            setCurrentSection(
                                protocol.data.find(
                                    (x) =>
                                        x.sectionId ===
                                        currentSection.sectionId - 1
                                )!
                            )
                        }}
                        className="h-8 w-8"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <Button
                        onClick={() =>
                            setCurrentSection(
                                protocol.data.find(
                                    (x) =>
                                        x.sectionId ===
                                        currentSection.sectionId + 1
                                )!
                            )
                        }
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useDebouncedValue } from '@mantine/hooks'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const string = `${process.env.NEXTURL}/api/protocol/${ctx.params?.id}`
    const data = await fetch(string).then((res) => res.json())
    console.log('*******FUNCIONA ESTO?*********', data.data[0]);
    
    return {
        props: { serverProtocol: data },
    }
}
