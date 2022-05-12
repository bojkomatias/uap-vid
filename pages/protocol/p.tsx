import { ReactElement, useState } from 'react'
import { Fragment } from 'react'
import { Popover } from '@headlessui/react'
import { Form } from '../../components/Protocol/Form'
import { ProtocolMetadata } from '../../config/metadata'
import { Section } from '../../config/types'
import Stepper from '../../components/Protocol/Stepper'

export default function ProtocolPage() {
    // ! this should be metadata IF NEW, and real data if EXISTING
    const [currentSection, setCurrentSection] = useState<Section>(
        ProtocolMetadata.data[0]
    )

    return (
        <>
            <div className="text-primary -translate-y-8  text-4xl font-bold">
                Protocolo de investigación
            </div>{' '}
            <div className="flex h-full -translate-y-8 flex-col">
                <Stepper
                    currentSection={currentSection}
                    setSection={setCurrentSection}
                />
                <Form section={currentSection} />
            </div>
        </>
    )
}
