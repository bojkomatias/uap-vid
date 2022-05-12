import React, { PropsWithChildren } from 'react'
import { ProtocolMetadata } from '../../config/metadata'
import { Section } from '../../config/types'
import { useForceUpdate } from '@mantine/hooks'
import { useState, useEffect } from 'react'

const Stepper = ({
    currentSection,
    setSection,
}: PropsWithChildren<{
    currentSection: Section
    setSection: Function
}>) => {
    return (
        <div className="mx-auto flex h-10 w-1/2  items-center justify-between gap-4 bg-base-100">
            {ProtocolMetadata.data.map((section: Section) => (
                <button
                    key={section.name}
                    className={`
        h-4 w-4 transform rounded-full  transition-all duration-500 ease-in-out 
            ${
                currentSection.name == section.name
                    ? 'scale-110 bg-primary hover:scale-125'
                    : 'scale-90 bg-base-300 hover:scale-100'
            }`}
                    onClick={() => setSection(section)}
                ></button>
            ))}
        </div>
    )
}

export default Stepper
