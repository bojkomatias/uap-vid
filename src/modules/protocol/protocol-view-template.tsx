import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { Role, type ProtocolSections } from '@prisma/client'
import BibliographyView from './view-sections/bibliography-view'
import DescriptionView from './view-sections/description-view'
import DurationView from './view-sections/duration-view'
import IdentificationView from './view-sections/identification-view'
import IntroductionView from './view-sections/introduction-view'
import MethodologyView from './view-sections/methodology-view'
import PublicationView from './view-sections/publication-view'
import BudgetView from './view-sections/budget-view'

export default async function View({
  sections,
}: {
  sections: ProtocolSections
}) {
  const session = await getServerSession(authOptions)

  if (session?.user.role === Role.METHODOLOGIST)
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
