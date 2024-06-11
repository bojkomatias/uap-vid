import { getReviewsByReviewerId } from '@repositories/review'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { ReviewerCertificatePDF } from 'modules/profile/reviewer-certificate'
import { getServerSession } from 'next-auth'
import React from 'react'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) return null
  const reviews = await getReviewsByReviewerId(session.user.id)

  return (
    <main>
      {children}{' '}
      {
        // Since not all users do evaluations/reviews, I'm checking for the user role before loading the component, therefore, improving the load time of the page.
        (session.user.role == 'SCIENTIST' ||
          session.user.role == 'METHODOLOGIST') && (
          <ReviewerCertificatePDF user={session.user} reviews={reviews} />
        )
      }
    </main>
  )
}
