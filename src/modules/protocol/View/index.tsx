import type { Protocol, Role } from '@prisma/client'
import BibliographyView from '@protocol/View/Sections/BibliographyView'
import BudgetView from '@protocol/View/Sections/BudgetView'
import DescriptionView from '@protocol/View/Sections/DescriptionView'
import IdentificationView from '@protocol/View/Sections/IdentificationView'
import IntroductionView from '@protocol/View/Sections/IntroductionView'
import MethodologyView from '@protocol/View/Sections/MethodologyView'
import PublicationView from '@protocol/View/Sections/PublicationView'
import DurationView from '@protocol/View/Sections/DurationView'

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
                <DescriptionView data={protocol.sections.description} />
                <MethodologyView data={protocol.sections.methodology} />
            </div>
        )
    if (role === 'SCIENTIST')
        return (
            <div className="px-4">
                <DescriptionView data={protocol.sections.description} />
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
            <DescriptionView data={protocol.sections.description} />
            <IntroductionView data={protocol.sections.introduction} />
            <MethodologyView data={protocol.sections.methodology} />
            <PublicationView data={protocol.sections.publication} />
            <BibliographyView data={protocol.sections.bibliography} />
        </div>
    )
}
