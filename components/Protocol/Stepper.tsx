import React, { PropsWithChildren } from 'react'
import { ProtocolMetadata } from '../../config/metadata'
import { Section } from '../../config/types'

const Stepper = ({
    currentSection,
    setSection,
}: PropsWithChildren<{ currentSection: Section; setSection: Function }>) => {
    return (
        <div className="mx-auto flex h-10 w-1/2  items-center justify-between gap-4 bg-base-100">
            {ProtocolMetadata.content.map((section: Section) => (
                <button
                    key={section.name}
                    className={`
                    h-8 w-8 transform rounded-full border transition-all duration-500 ease-in-out 
                        ${
                            currentSection.name == section.name
                                ? 'scale-110 bg-primary-700 hover:scale-125'
                                : 'scale-90 bg-base-300 hover:scale-100'
                        }`}
                    onClick={() => setSection(section)}
                ></button>
            ))}
        </div>
    )
}

export default Stepper
