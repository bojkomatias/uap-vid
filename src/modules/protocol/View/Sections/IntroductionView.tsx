import { ProtocolSectionsIntroduction } from '@prisma/client'
import RichViewer from '@protocol/elements/RichViewer'
import React from 'react'
import SectionLayout from './SectionLayout'

interface IntroductionViewProps {
    data: ProtocolSectionsIntroduction
}

const IntroductionView = ({ data }: IntroductionViewProps) => {
    return (
        <SectionLayout
            title="Introducción"
            description="Introducción al proyecto"
        >
            <RichViewer title='Problemática' content={data.problem} />
            <RichViewer title='Estado' content={data.state} />
            <RichViewer title='Objetivos' content={data.objectives} />
            <RichViewer title='Justificación' content={data.justification} />
        </SectionLayout>
    )
}

export default IntroductionView
