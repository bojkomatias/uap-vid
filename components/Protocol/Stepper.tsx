import React, { PropsWithChildren } from 'react'
import { ProtocolMetadata } from '../../config/metadata'
import { Section } from '../../config/types'

import { useForceUpdate } from '@mantine/hooks'

const Stepper = ({
    currentSection,
}: PropsWithChildren<{
    currentSection: Section
}>) => {
    return (
        <div className="mx-auto mt-10 mb-6 flex h-10 w-2/3 items-center justify-between gap-4">
            {ProtocolMetadata.data.map((section, index) => (
                <button
                    key={index}
                    className={`
        h-4 w-4 transform rounded-full  transition-all duration-500 ease-in-out 
            ${
                currentSection.id == index + 1
                    ? 'scale-125 cursor-default bg-primary'
                    : currentSection.id > index + 1
                    ? 'scale-110 cursor-default bg-primary'
                    : 'scale-90 cursor-default bg-base-300'
            }`}
                ></button>
            ))}
        </div>
    )
}

export default Stepper
