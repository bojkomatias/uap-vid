import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { type ProtocolSections } from '@prisma/client'
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
  return (
    <>
      <IdentificationView data={sections.identification} />
      <DurationView data={sections.duration} />
      <BudgetView data={sections.budget} />
      <DescriptionView data={sections.description} />
      <IntroductionView data={sections.introduction} />
      <MethodologyView data={sections.methodology} />
      <PublicationView data={sections.publication} />
      <BibliographyView data={sections.bibliography} />
    </>
  )
}
