import type { Role } from '@prisma/client'
import { ReviewVerdict } from '@prisma/client'
import { getReviewsByProtocol } from '@repositories/review'
import ReviewItem from './review-item'
import { Heading } from '@components/heading'
import { Divider } from '@components/divider'
import { Text } from '@components/text'

import HideReviewsButton from '@protocol/elements/hide-reviews-button'

type ReviewStateProps = {
  id: string
  role: Role
  isOwner: boolean
}
export async function ReviewList({ id, role, isOwner }: ReviewStateProps) {
  const reviews = await getReviewsByProtocol(id)

  return (
    <>
      <div>
        <Heading className="flex items-center justify-between">
          Revisiones
          <HideReviewsButton />
        </Heading>
        <Text>Las revisiones realizadas por evaluadores</Text>
      </div>
      {reviews.some((r) => r.verdict !== ReviewVerdict.NOT_REVIEWED) ?
        <ul role="list" className="space-y-6">
          {reviews.map((r, i) => (
            <>
              {i === 0 ?
                <Divider />
              : <Divider soft />}
              <ReviewItem key={i} review={r} role={role} isOwner={isOwner} />
            </>
          ))}
        </ul>
      : null}
    </>
  )
}
