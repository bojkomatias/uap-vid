import { Badge } from '@elements/badge'
import { ReviewVerdict } from '@prisma/client'
import { cx } from '@utils/cx'
import ReviewVerdictsDictionary from '@utils/dictionaries/ReviewVerdictsDictionary'

export default function ReviewVerdictBadge({
  verdict,
}: {
  verdict: ReviewVerdict
}) {
  return (
    <Badge
      className={cx(
        verdict === ReviewVerdict.APPROVED_WITH_CHANGES &&
          'ring-1 ring-warning-500/50',
        verdict === ReviewVerdict.APPROVED && 'ring-1 ring-success-500/50',
        verdict === ReviewVerdict.REJECTED && 'ring-1 ring-error-500/50'
      )}
    >
      <div
        className={cx(
          'mr-1 h-1.5 w-1.5 rounded',
          verdict === ReviewVerdict.APPROVED_WITH_CHANGES && 'bg-warning-500',
          verdict === ReviewVerdict.APPROVED && 'bg-success-500',
          verdict === ReviewVerdict.REJECTED && 'bg-error-500'
        )}
      />
      {ReviewVerdictsDictionary[verdict]}
    </Badge>
  )
}
