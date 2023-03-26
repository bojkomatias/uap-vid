import type { Protocol, Role } from '@prisma/client'
import dynamic from 'next/dynamic'
const IdentificationView = dynamic(
    () => import('@protocol/View/Sections/IdentificationView')
)
const BibliographyView = dynamic(
    () => import('@protocol/View/Sections/BibliographyView')
)
const DescriptionView = dynamic(
    () => import('@protocol/View/Sections/DescriptionView')
)
const BudgetView = dynamic(() => import('@protocol/View/Sections/BudgetView'))
const DurationView = dynamic(
    () => import('@protocol/View/Sections/DurationView')
)
const IntroductionView = dynamic(
    () => import('@protocol/View/Sections/IntroductionView')
)
const MethodologyView = dynamic(
    () => import('@protocol/View/Sections/MethodologyView')
)
const PublicationView = dynamic(
    () => import('@protocol/View/Sections/PublicationView')
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
