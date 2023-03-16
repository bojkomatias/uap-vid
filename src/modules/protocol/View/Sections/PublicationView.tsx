import { ProtocolSectionsPublication } from '@prisma/client'
import React from 'react'
import SectionLayout from './SectionLayout'

interface PublicationViewProps {
    data: ProtocolSectionsPublication
}

const PublicationView = ({ data }: PublicationViewProps) => {
    return (
        <SectionLayout
            title="Publicación"
            description="Que se publicará al finalizar el proyecto"
        >
            <p></p>
        </SectionLayout>
    )
}

export default PublicationView
