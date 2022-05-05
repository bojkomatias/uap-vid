import React, { PropsWithChildren } from 'react'
import { ProtocolMetadata } from '../../config/metadata'
import { Section } from '../../config/types'

const Stepper = ({
    currentSection,
    setSection,
}: PropsWithChildren<{ currentSection: Section; setSection: Function }>) => {
    return (
        <div className="mx-auto flex h-2 w-1/4 items-center justify-between gap-6 bg-base-100">
            {ProtocolMetadata.content.map((section: Section) => (
                <button
                    key={section.name}
                    className={`
                    rounded-full h-8 w-8 transform border transition-all duration-500 ease-in-out 
                        ${
                            currentSection.name == section.name
                                ? 'scale-100 bg-primary-700 hover:scale-110'
                                : 'scale-75 bg-base-300 hover:scale-90'
                        }`}
                    onClick={() => setSection(section)}
                ></button>
            ))}
        </div>
    )
}

export default Stepper
