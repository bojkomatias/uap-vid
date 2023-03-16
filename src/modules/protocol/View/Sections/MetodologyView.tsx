import { ProtocolSectionsMethodology } from '@prisma/client'
import React from 'react'
import SectionLayout from './SectionLayout'

interface MetodologyViewProps {
    data: ProtocolSectionsMethodology
}

const MetodologyView = ({ data }: MetodologyViewProps) => {
    return (
        <SectionLayout
            title="Metodología"
            description="Metodología del proyecto"
        >
            <p></p>
        </SectionLayout>
    )
}

export default MetodologyView
