import type { Role } from '@prisma/client'
import { ReviewVerdict } from '@prisma/client'
import { getReviewsByProtocol } from '@repositories/review'
import ReviewItem from './review-item'

type ReviewStateProps = {
  id: string
  role: Role
  isOwner: boolean
}
async function ReviewList({ id, role, isOwner }: ReviewStateProps) {
  const reviews = await getReviewsByProtocol(id)

  if (
    !reviews ||
    reviews.every((r) => r.verdict === ReviewVerdict.NOT_REVIEWED)
  )
    return null

  return (
    <div className="w-full lg:w-[28rem] xl:w-[36rem]">
      <h3 className="ml-2 text-lg font-semibold text-gray-900">Revisiones</h3>
      {reviews.some((r) => r.verdict !== ReviewVerdict.NOT_REVIEWED) ? (
        <ul role="list" className="space-y-3 px-1">
          {reviews.map((r, i) => (
            <>
              <ReviewItem key={i} review={r} role={role} isOwner={isOwner} />
            </>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default ReviewList
