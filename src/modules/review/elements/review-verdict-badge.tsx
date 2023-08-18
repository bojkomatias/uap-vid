import { ReviewVerdict } from '@prisma/client'
import { cx } from '@utils/cx'
import ReviewVerdictsDictionary from '@utils/dictionaries/ReviewVerdictsDictionary'

export default function ReviewVerdictBadge({
    verdict,
}: {
    verdict: ReviewVerdict
}) {
    return (
        <span
            className={cx(
                'flex items-center gap-2 rounded-full bg-white px-2 py-0.5 text-xs font-medium uppercase',
                verdict === ReviewVerdict.APPROVED_WITH_CHANGES &&
                    'ring-1 ring-warning-500/50',
                verdict === ReviewVerdict.APPROVED &&
                    'ring-1 ring-success-500/50',
                verdict === ReviewVerdict.REJECTED && 'ring-1 ring-error-500/50'
            )}
        >
            <div
                className={cx(
                    'h-2 w-2 rounded',
                    verdict === ReviewVerdict.APPROVED_WITH_CHANGES &&
                        'bg-warning-500',
                    verdict === ReviewVerdict.APPROVED && 'bg-success-500',
                    verdict === ReviewVerdict.REJECTED && 'bg-error-500'
                )}
            />
            {ReviewVerdictsDictionary[verdict]}
        </span>
    )
}
