import type { ProtocolSections, Role } from '@prisma/client'
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
    sections,
    role,
}: {
    sections: ProtocolSections
    role: Role
}) {
    if (role === 'METHODOLOGIST')
        return (
            <div className="px-2">
                <IdentificationView data={sections.identification} />
                <DurationView data={sections.duration} />
                <DescriptionView data={sections.description} />
                <MethodologyView data={sections.methodology} />
            </div>
        )
    return (
        <div className="px-2">
            <IdentificationView data={sections.identification} />
            <DurationView data={sections.duration} />
            <BudgetView data={sections.budget} />
            <DescriptionView data={sections.description} />
            <IntroductionView data={sections.introduction} />
            <MethodologyView data={sections.methodology} />
            <PublicationView data={sections.publication} />
            <BibliographyView data={sections.bibliography} />
        </div>
    )
}
