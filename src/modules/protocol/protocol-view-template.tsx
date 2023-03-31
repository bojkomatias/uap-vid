import type { Protocol, Role } from '@prisma/client'
import dynamic from 'next/dynamic'
const IdentificationView = dynamic(
    () => import('@protocol/view-sections/identification-view')
)
const BibliographyView = dynamic(
    () => import('@protocol/view-sections/bibliography-view')
)
const DescriptionView = dynamic(
    () => import('@protocol/view-sections/description-view')
)
const BudgetView = dynamic(() => import('@protocol/view-sections/budget-view'))
const DurationView = dynamic(
    () => import('@protocol/view-sections/duration-view')
)
const IntroductionView = dynamic(
    () => import('@protocol/view-sections/introduction-view')
)
const MethodologyView = dynamic(
    () => import('@protocol/view-sections/methodology-view')
)
const PublicationView = dynamic(
    () => import('@protocol/view-sections/publication-view')
)

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
