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
            <div className="-translate-y-12 text-4xl font-bold text-primary">
                Protocolo de investigación
            </div>{' '}
            <div className="my-auto flex w-full justify-around px-5">
                <Button
                    onClick={() => {
                        if (currentSection.id == 1) return
                        setCurrentSection(
                            ProtocolMetadata.data[currentSection.id - 2]
                        )
                    }}
                >
                    <ChevronLeftIcon className="w-6" />
                </Button>
                <div className="mb-4 flex flex-1 -translate-y-12 flex-col">
                    <Stepper currentSection={currentSection} />
                    <Form section={currentSection} />
                </div>

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
        </>
    )
}
