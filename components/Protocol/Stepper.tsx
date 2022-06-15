import React, { PropsWithChildren } from 'react'

import { useForceUpdate } from '@mantine/hooks'

const Stepper = ({
    protocolLength,
    currentSection,
}: PropsWithChildren<{
    protocolLength: number
    currentSection: number
}>) => {
    const protocolList = Array.from({ length: protocolLength }, (_, index) => index + 1)
    return (
        <div className="mx-auto mt-10 mb-6 flex h-10 w-2/3 items-center justify-between gap-4">
            {protocolList.map(section => (
                <button
                    key={section}
                    className={`
        h-4 w-4 transform rounded-full  transition-all duration-500 ease-in-out 
            ${currentSection == section
                            ? 'scale-125 bg-primary'
                            : currentSection > section
                                ? 'scale-110 bg-secondary-600'
                                : 'scale-90 bg-base-300 hover:scale-100'
                        }`}
                ></button>
            ))}
        </div>
    )
}

export default Stepper
