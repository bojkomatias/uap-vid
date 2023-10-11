import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import ProfileDrawer from 'modules/profile/profile-info-drawer'
import { getReviewsByReviewerId } from '@repositories/review'
import { ReviewerCertificatePDF } from 'modules/profile/reviewer-certificate'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) return
    const reviews = await getReviewsByReviewerId(session.user.id)

    return (
        <ProfileDrawer
            certificate={
                // Since not all users do evaluations/reviews, I'm checking for the user role before loading the component, therefore, improving the load time of the page.
                (session.user.role == 'SCIENTIST' ||
                    session.user.role == 'METHODOLOGIST') && (
                    <ReviewerCertificatePDF
                        user={session.user}
                        reviews={reviews}
                    />
                )
            }
            user={session.user}
        />
    )
}
