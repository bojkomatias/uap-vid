import { Dots } from 'tabler-icons-react'
import TipTapViewer from '@protocol/elements/TipTapViewer'
import { Review, User } from '@prisma/client'
import ReviewVerdictsDictionary from '@utils/dictionaries/ReviewVerdictsDictionary'
import ReviewTypesDictionary from '@utils/dictionaries/ReviewTypesDictionary'

export default function ReviewItem({
    review,
    user, // The user that is viewing the component
}: {
    review: Review
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
                <div className="-mb-px flex items-end justify-between space-x-4 rounded-t border bg-gray-50 px-2 py-1 text-gray-500">
                    <div className="text-sm font-light text-gray-700">
                        {ReviewTypesDictionary[review.type]}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-light text-gray-600">
                        <span>{ReviewVerdictsDictionary[review.verdict]}</span>
                        <div className="h-2 w-2 rounded bg-primary" />
                    </div>
                    <div className="cursor-pointer rounded py-0.5 px-1 hover:bg-gray-200">
                        {review.revised}
                    </div>
                </div>
                <TipTapViewer
                    title={''}
                    content={review.data}
                    rounded={false}
                />
                <div className="-mt-px flex justify-end gap-1 rounded-b border bg-gray-50 px-3 py-0.5 text-xs">
                    <span className="font-semibold text-gray-700"></span>
                    <span className="font-light text-gray-500">
                        {getDuration(
                            new Date().getTime() -
                                new Date(review.createdAt).getTime()
                        )}
                    </span>
                </div>
            </div>
        </li>
    )
}
