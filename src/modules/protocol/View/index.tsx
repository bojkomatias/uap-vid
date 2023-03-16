import type { protocol } from '@prisma/client'
import IdentificationView from '@protocol/View/Sections/IdentificationView'
import BibliographyView from './Sections/BibliographyView'
import BudgetView from './Sections/BudgetView'
import DescriptionSection from './Sections/DescriptionView'
import DurationView from './Sections/DurationView'
import IntroductionView from './Sections/IntroductionView'
import MethodologyView from './Sections/MethodologyView'
import PublicationView from './Sections/PublicationView'

export default function View({ protocol }: { protocol: protocol }) {
    return (
        <div className="px-4">
            <IdentificationView data={protocol.sections.identification} />
            <DurationView data={protocol.sections.duration} />
            <BudgetView data={protocol.sections.budget} />
            <DescriptionSection data={protocol.sections.description} />
            <IntroductionView data={protocol.sections.introduction} />
            <MethodologyView data={protocol.sections.methodology} />
            <PublicationView data={protocol.sections.publication} />
            <BibliographyView data={protocol.sections.bibliography} />

            <pre className="text-[0.5rem]">
                {JSON.stringify(protocol, null, 2)}
            </pre>
        </div>
    )
}
