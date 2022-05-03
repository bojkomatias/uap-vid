import { ReactElement, useState } from 'react'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Form } from '../../components/Protocol/Form'
import { ProtocolMetadata } from '../../config/metadata'
import { Section } from '../../config/types'

export default function ProtocolPage() {
    const [currentSection, setCurrentSection] = useState()
    return (
        <div className="mx-auto my-16 min-h-screen max-w-7xl px-4 sm:my-24 sm:px-6">
            {ProtocolMetadata.content.map((section: Section) => (
                <Form key={section.name} section={section} />
            ))}
        </div>
    )
}
