import { Review, User } from '@prisma/client'
import { canAccess } from '@utils/scopes'
import { ACCESS } from '@utils/zod'
import ReviewComment from './Comment'

// Why is the access here? Because its making a difference between 'COMMENT' action and 'REVIEWS' access, the second one allows read all... The first one should only allow read/write of own comments/reviews

export default function ReviewView({
    user,
    reviews,
}: {
    user: User
    reviews: Review[]
}) {
    if (!canAccess(ACCESS.REVIEWS, user.role)) return <></>
    if (reviews.length === 0) return <></>
    return <ReviewComment comments={reviews[0].comments} />
}
