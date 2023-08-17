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
                {
                    'ring-1 ring-warning-500/50':
                        verdict === ReviewVerdict.APPROVED_WITH_CHANGES,
                    'ring-1 ring-success-500/50':
                        verdict === ReviewVerdict.APPROVED,
                    'ring-1 ring-error-500/50':
                        verdict === ReviewVerdict.REJECTED,
                }
            )}
        >
            <div
                className={cx('h-2 w-2 rounded', {
                    'bg-warning-500 ':
                        verdict === ReviewVerdict.APPROVED_WITH_CHANGES,
                    'bg-success-600': verdict === ReviewVerdict.APPROVED,
                    'bg-error-600': verdict === ReviewVerdict.REJECTED,
                })}
            />
            {ReviewVerdictsDictionary[verdict]}
        </span>
    )
}
