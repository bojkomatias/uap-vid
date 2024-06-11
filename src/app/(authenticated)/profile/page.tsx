import { PageHeading } from '@layout/page-heading'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getServerSession } from 'next-auth'
import { ReviewerCertificatePDF } from 'modules/profile/reviewer-certificate'
import { getReviewsByReviewerId } from '@repositories/review'
import { ProfileInfo } from 'modules/profile/profile-info-drawer'

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) return
  const reviews = await getReviewsByReviewerId(session.user.id)

  return (
    <main className="mx-16">
      <PageHeading title="Perfil" />
      <ProfileInfo
        certificate={
          // Since not all users do evaluations/reviews, I'm checking for the user role before loading the component, therefore, improving the load time of the page.
          (session.user.role == 'SCIENTIST' ||
            session.user.role == 'METHODOLOGIST') && (
            <ReviewerCertificatePDF user={session.user} reviews={reviews} />
          )
        }
        user={session.user}
      />
    </main>
  )
}
