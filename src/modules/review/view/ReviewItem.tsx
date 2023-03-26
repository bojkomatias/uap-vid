import { MessageCircle } from 'tabler-icons-react'
import Image from 'next/image'
import TipTapViewer from '@protocol/elements/TipTapViewer'
import { Heading } from '@layout/Heading'
import { Review } from '@prisma/client'

export default function ReviewItem({ review }: { review: Review }) {
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
            <div className="flex items-start space-x-3">
                <div className="min-w-0 flex-1">
                    <p className="mt-0.5 text-xs text-gray-500">
                        <span className="text-sm text-gray-700 font-light uppercase">
                            {/* TODO: Make better UI */}
                            {review.type}
                        </span>
                        {getDuration(
                            new Date().getTime() -
                                new Date(review.createdAt).getTime()
                        )}
                    </p>

                    <div className="mt-2 text-sm text-gray-700">
                        <TipTapViewer title={''} content={review.data} />
                    </div>
                </div>
            </div>
        </li>
    )
}
