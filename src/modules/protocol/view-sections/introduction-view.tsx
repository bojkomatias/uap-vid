import type { ProtocolSectionsIntroduction } from '@prisma/client'
import TextItemView from '@protocol/elements/view/text-item-view'

import SectionViewer from '../elements/view/section-viewer'

interface IntroductionViewProps {
    data: ProtocolSectionsIntroduction
}

const IntroductionView = ({ data }: IntroductionViewProps) => {
    return (
        <SectionViewer
            title="Introducción"
            description="Introducción al proyecto"
        >
            <TextItemView title="Problemática" content={data.problem} />
            <TextItemView title="Estado" content={data.state} />
            <TextItemView title="Objetivos" content={data.objectives} />
            <TextItemView title="Justificación" content={data.justification} />
        </SectionViewer>
    )
}

export default IntroductionView
