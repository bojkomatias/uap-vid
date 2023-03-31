import { ProtocolSectionsIntroduction } from '@prisma/client'
import TipTapViewer from '@protocol/elements/TipTapViewer'
import SectionLayout from '../elements/section-viewer'

interface IntroductionViewProps {
    data: ProtocolSectionsIntroduction
}

const IntroductionView = ({ data }: IntroductionViewProps) => {
    return (
        <SectionLayout
            title="Introducción"
            description="Introducción al proyecto"
        >
            <TipTapViewer title="Problemática" content={data.problem} />
            <TipTapViewer title="Estado" content={data.state} />
            <TipTapViewer title="Objetivos" content={data.objectives} />
            <TipTapViewer title="Justificación" content={data.justification} />
        </SectionLayout>
    )
}

export default IntroductionView
