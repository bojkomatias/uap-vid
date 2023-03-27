import TipTapViewer from '@protocol/elements/TipTapViewer'
import { Review, ReviewVerdict, Role, State, User } from '@prisma/client'
import ReviewVerdictsDictionary from '@utils/dictionaries/ReviewVerdictsDictionary'
import ReviewTypesDictionary from '@utils/dictionaries/ReviewTypesDictionary'
import clsx from 'clsx'

export default function ReviewItem({
    review,
    user, // The user that is viewing the component
}: {
    review: Review & { reviewer: User }
    user: User
}) {
    function getDuration(millis: number) {
        let minutes = Math.floor(millis / 60000)
        let hours = Math.round(minutes / 60)
        let days = Math.round(hours / 24)

        return (
            ' hace ' + (days && days + (days > 1 ? ' días' : ' día')) ||
            (hours && hours + (hours > 1 ? '  horas' : ' hora')) ||
            minutes + (minutes > 1 ? '  minutos' : ' minuto')
        )
    }

    return (
        <li>
            <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500">
                    {ReviewTypesDictionary[review.type]}
                </dt>

                <div className="-mb-px flex items-center justify-between space-x-4 rounded-t border bg-gray-50 px-2 py-1 text-gray-500">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Estado:</span>
                        <span
                            className={clsx(
                                'flex items-center gap-1 rounded bg-white px-2 py-px text-xs font-light uppercase',
                                {
                                    'ring-1 ring-warning-500/50':
                                        review.verdict ===
                                        ReviewVerdict.PENDING,
                                    'ring-1 ring-success-500/50':
                                        review.verdict ===
                                        ReviewVerdict.APPROVED,
                                    'ring-1 ring-error-500/50':
                                        review.verdict ===
                                        ReviewVerdict.REJECTED,
                                }
                            )}
                        >
                            {ReviewVerdictsDictionary[review.verdict]}
                            <div
                                className={clsx('h-2 w-2 rounded', {
                                    'bg-warning-500 ':
                                        review.verdict ===
                                        ReviewVerdict.PENDING,
                                    'bg-success-600':
                                        review.verdict ===
                                        ReviewVerdict.APPROVED,
                                    'bg-error-600':
                                        review.verdict ===
                                        ReviewVerdict.REJECTED,
                                })}
                            />
                        </span>
                    </div>

                    {review.verdict === ReviewVerdict.PENDING ? (
                        user.role === Role.RESEARCHER ? (
                            <span>
                                <input
                                    id={`revised-${review.id}`}
                                    name={`revised-${review.id}`}
                                    type="checkbox"
                                    className="mr-1 mb-0.5 h-3.5 w-3.5 rounded-md border-gray-300 text-primary focus:ring-primary"
                                />

                                <label
                                    htmlFor={`revised-${review.id}`}
                                    className="label pointer-events-auto"
                                >
                                    revisado
                                </label>
                            </span>
                        ) : (
                            <label className="label pointer-events-auto">
                                {review.revised ? 'revisado' : 'no revisado'}
                            </label>
                        )
                    ) : null}
                </div>

                <TipTapViewer title="" content={review.data} rounded={false} />

                <div className="-mt-px flex justify-end gap-1 rounded-b border bg-gray-50 px-3 py-0.5 text-xs">
                    <span className="font-semibold text-gray-700">
                        {user.role === Role.ADMIN || Role.SECRETARY
                            ? review.reviewer.name
                            : null}
                    </span>
                    <span className="font-light text-gray-500">
                        {getDuration(
                            new Date().getTime() -
                                new Date(review.updatedAt).getTime()
                        )}
                    </span>
                </div>
            </div>
        </li>
    )
}
