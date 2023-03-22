import { ProtocolSectionsIntroduction } from '@prisma/client'
import RTEViewer from '@protocol/elements/RTEViewer'
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
            <RTEViewer title="Problemática" content={data.problem} />
            <RTEViewer title="Estado" content={data.state} />
            <RTEViewer title="Objetivos" content={data.objectives} />
            <RTEViewer title="Justificación" content={data.justification} />
        </SectionLayout>
    )
}

export default IntroductionView
