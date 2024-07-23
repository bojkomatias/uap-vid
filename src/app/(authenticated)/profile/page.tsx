import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { getServerSession } from 'next-auth'
import { ReviewerCertificatePDF } from 'modules/profile/reviewer-certificate'
import { getReviewsByReviewerId } from '@repositories/review'
import { ProfileInfo } from 'modules/profile/profile-info'
import { Role } from '@prisma/client'
import { Heading } from '@components/heading'

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) return
  const reviews = await getReviewsByReviewerId(session.user.id)

  return (
    <>
      <Heading>Perfil de usuario</Heading>
      <ProfileInfo
        certificate={
          // Since not all users do evaluations/reviews, I'm checking for the user role before loading the component, therefore, improving the load time of the page.
          (session.user.role == Role.SCIENTIST ||
            session.user.role == Role.METHODOLOGIST) && (
            <ReviewerCertificatePDF user={session.user} reviews={reviews} />
          )
        }
        user={session.user}
      />
    </>
  )
}
