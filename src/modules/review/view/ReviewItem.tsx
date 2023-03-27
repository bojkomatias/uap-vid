import { Dots, MessageCircle } from 'tabler-icons-react'
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
            <div className="min-w-0 flex-1">
                <div className="text-gray-500 bg-gray-50 border -mb-px px-2 pb-0.5 pt-1 rounded-t space-x-4 flex items-end justify-between">
                    <div className="text-sm text-gray-700 font-light uppercase">
                        {review.type}
                    </div>
                    <div className="text-sm text-gray-600 font-light lowercase flex items-center gap-1">
                        <div className="h-2 w-2 bg-primary rounded" />
                        <span>{review.verdict}</span>
                    </div>
                    <div className="hover:bg-gray-200 cursor-pointer rounded py-0.5 px-1">
                        <Dots className="h-5 w-5" />
                    </div>
                </div>
                <TipTapViewer
                    title={''}
                    content={review.data}
                    rounded={false}
                />
                <div className="flex justify-end bg-gray-50 border rounded-b text-xs px-3 py-0.5 -mt-px text-gray-600">
                    <span>admin only-ref to user??</span>
                    <span>
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
