import { ReactElement, useState } from 'react'
import { Fragment } from 'react'
import { Popover } from '@headlessui/react'
import { Form } from '../../components/Protocol/Form'
import { ProtocolMetadata } from '../../config/metadata'
import { Section } from '../../config/types'
import Stepper from '../../components/Protocol/Stepper'
import { Button } from '../../components/Atomic/Button'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'

export default function ProtocolPage() {
    // ! this should be metadata IF NEW, and real data if EXISTING
    const [currentSection, setCurrentSection] = useState<Section>(
        ProtocolMetadata.data[0]
    )

    return (
        <>
            <div className="-translate-y-8 text-4xl font-bold text-primary">
                Protocolo de investigación
            </div>{' '}
            <div className="flex h-full -translate-y-8 flex-col">
                <Stepper currentSection={currentSection} />
                <Form section={currentSection} />
                <div className="flex w-full justify-between px-8">
                    <Button
                        onClick={() => {
                            if (currentSection.id == 1) return
                            setCurrentSection(
                                ProtocolMetadata.data[currentSection.id - 2]
                            )
                        }}
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <Button
                        onClick={() =>
                            setCurrentSection(
                                ProtocolMetadata.data[currentSection.id]
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
