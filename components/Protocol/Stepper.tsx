import React, { PropsWithChildren } from 'react'
import { ProtocolMetadata } from '../../config/metadata'
import { Section } from '../../config/types'

const Stepper = ({
    currentSection,
}: PropsWithChildren<{
    currentSection: Section
}>) => {
    return (
        <div className="mx-auto mt-8 flex h-10 w-2/3 items-center justify-between gap-4 ">
            {ProtocolMetadata.data.map((section, index) => (
                <button
                    key={index}
                    className={`
        h-4 w-4 transform rounded-full  transition-all duration-500 ease-in-out 
            ${
                currentSection.id == index + 1
                    ? 'scale-125 bg-primary'
                    : currentSection.id > index + 1
                    ? 'scale-110 bg-secondary-600'
                    : 'scale-90 bg-base-300 hover:scale-100'
            }`}
                ></button>
            ))}
        </div>
    )
}

export default Stepper
