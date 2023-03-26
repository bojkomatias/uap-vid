import type { Protocol, Role } from '@prisma/client'
import { BibliographyViewProps } from '@protocol/View/Sections/BibliographyView'
import { BudgetViewProps } from '@protocol/View/Sections/BudgetView'
import { DescriptionViewProps } from '@protocol/View/Sections/DescriptionView'
import { IdentificationProps } from '@protocol/View/Sections/IdentificationView'
import { IntroductionViewProps } from '@protocol/View/Sections/IntroductionView'
import { MethodologyViewProps } from '@protocol/View/Sections/MethodologyView'
import { PublicationViewProps } from '@protocol/View/Sections/PublicationView'
import dynamic from 'next/dynamic'
const IdentificationView = dynamic<IdentificationProps>(
    () => import('@protocol/View/Sections/IdentificationView')
)
const BibliographyView = dynamic<BibliographyViewProps>(
    () => import('@protocol/View/Sections/BibliographyView')
)
const DescriptionView = dynamic<DescriptionViewProps>(
    () => import('@protocol/View/Sections/DescriptionView')
)
const BudgetView = dynamic<BudgetViewProps>(
    () => import('@protocol/View/Sections/BudgetView')
)
const DurationView = dynamic(
    () => import('@protocol/View/Sections/DurationView')
)
const IntroductionView = dynamic<IntroductionViewProps>(
    () => import('@protocol/View/Sections/IntroductionView')
)
const MethodologyView = dynamic<MethodologyViewProps>(
    () => import('@protocol/View/Sections/MethodologyView')
)
const PublicationView = dynamic<PublicationViewProps>(
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
