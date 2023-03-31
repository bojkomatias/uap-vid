import { ProtocolSectionsIntroduction } from '@prisma/client'
import TipTapViewer from '@protocol/elements/text-item-view'
import SectionViewer from '../elements/section-viewer'

interface IntroductionViewProps {
    data: ProtocolSectionsIntroduction
}

const IntroductionView = ({ data }: IntroductionViewProps) => {
    return (
        <SectionViewer
            title="Introducción"
            description="Introducción al proyecto"
        >
            <TipTapViewer title="Problemática" content={data.problem} />
            <TipTapViewer title="Estado" content={data.state} />
            <TipTapViewer title="Objetivos" content={data.objectives} />
            <TipTapViewer title="Justificación" content={data.justification} />
        </SectionViewer>
    )
}

export default IntroductionView
