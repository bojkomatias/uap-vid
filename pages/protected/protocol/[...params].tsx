import { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { Button } from '../../../components/Atomic/Button'
import { Section } from '../../../config/types'
import Stepper from '../../../components/Protocol/Stepper'
import { Form } from '../../../components/Protocol/Form'

export default function ProtocolPage({
    section,
    protocolId,
    protocolLength,
}: {
    section: Section
    protocolId: number
    protocolLength: number
}) {
    const router = useRouter()
    const [savedEvent, setSavedEvent] = useState(false)
    const [isSectionComplete, setSectionComplete] = useState()
    const refreshData = () => {
        router.replace(router.asPath)
    }
    useEffect(() => {
        setTimeout(() => {
            setSavedEvent(false)
        }, 3000)
    }, [savedEvent])

    const updateSection = async (section: Section) => {
        let timeout
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
            console.log('Guardando en la DB', section)

            const res = await fetch(
                `/api/section/${protocolId}/${section?.sectionId}`,
                {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(section),
                }
            )
            setSavedEvent(true)
        }, 5000)
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
            </div>{' '}
            <div className="flex h-full -translate-y-8 flex-col">
                <Stepper
                    protocolLength={protocolLength}
                    currentSection={section?.sectionId}
                />

                <div className="flex min-h-[70vh] w-full items-start justify-between px-8 pb-8">
                    <Button
                        disabled={section?.sectionId === 1}
                        onClick={() => {
                            router.push(
                                `/protected/protocol/${protocolId}/${
                                    section?.sectionId - 1
                                }`
                            )
                        }}
                        className="h-8 w-8"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <Form
                        section={section}
                        updateSection={updateSection}
                        setSectionComplete={setSectionComplete}
                    />

                    <Button
                        disabled={!isSectionComplete}
                        onClick={() =>
                            router.push(
                                `/protected/protocol/${protocolId}/${
                                    section?.sectionId + 1
                                }`
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const [protocolId, sectionId] = ctx.params?.params as string[]
    const string = `${process.env.NEXTURL}/api/section/${protocolId}/${sectionId}`
    const data = await fetch(string).then((res) => res.json())

    return {
        props: { ...data, protocolId },
    }
}
