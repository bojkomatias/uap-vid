import { ReviewsComments } from '@prisma/client'
import { MessageCircle } from 'tabler-icons-react'
import Image from 'next/image'
import RTEViewer from '@protocol/elements/RTEViewer'
import { Heading } from '@layout/Heading'

export default function ReviewComment({
    comments,
}: {
    comments: ReviewsComments[]
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
        <ul role="list" className="px-4 space-y-3 w-[27rem]">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Comentarios
            </h3>
            {comments?.reverse().map((comment, commentIdx) => (
                <li key={commentIdx}>
                    <div className="flex items-start space-x-3">
                        <div className="min-w-0 flex-1">
                            <p className="mt-0.5 text-xs text-gray-500">
                                <span className="text-sm text-gray-700 font-light uppercase">
                                    Metodólogo
                                </span>
                                {getDuration(
                                    new Date().getTime() -
                                        new Date(comment.date).getTime()
                                )}
                            </p>

                            <div className="mt-2 text-sm text-gray-700">
                                <RTEViewer title={''} content={comment.data} />
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}
