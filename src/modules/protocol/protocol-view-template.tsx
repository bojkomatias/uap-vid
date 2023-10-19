import type { ProtocolSections } from '@prisma/client'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
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

export default async function View({
    sections,
}: {
    sections: ProtocolSections
}) {
    const session = await getServerSession(authOptions)

    if (session?.user.role === 'METHODOLOGIST')
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
