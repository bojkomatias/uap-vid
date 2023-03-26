import type { Protocol, Role } from '@prisma/client'
import IdentificationView from '@protocol/View/Sections/IdentificationView'
import BibliographyView from './Sections/BibliographyView'
import BudgetView from './Sections/BudgetView'
import DescriptionSection from './Sections/DescriptionView'
import DurationView from './Sections/DurationView'
import IntroductionView from './Sections/IntroductionView'
import MethodologyView from './Sections/MethodologyView'
import PublicationView from './Sections/PublicationView'

export default function View({
    protocol,
    role,
}: {
    protocol: Protocol
    role: Role
}) {
    if (role === 'METHODOLOGIST')
        return (
            <div className="px-4">
                <IdentificationView data={protocol.sections.identification} />
                <DurationView data={protocol.sections.duration} />
                <DescriptionSection data={protocol.sections.description} />
                <MethodologyView data={protocol.sections.methodology} />
            </div>
        )
    if (role === 'SCIENTIST')
        return (
            <div className="px-4">
                <DescriptionSection data={protocol.sections.description} />
                <IntroductionView data={protocol.sections.introduction} />
                <PublicationView data={protocol.sections.publication} />
                <BibliographyView data={protocol.sections.bibliography} />
            </div>
        )
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
        </div>
    )
}
