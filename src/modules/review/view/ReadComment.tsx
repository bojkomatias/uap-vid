import { ProtocolReviewsComments } from '@prisma/client'
import { MessageCircle } from 'tabler-icons-react'
import Image from 'next/image'
import RTEViewer from '@protocol/elements/RTEViewer'

export default function ReadComment({
    comments,
}: {
    comments?: ProtocolReviewsComments[]
}) {
    function getDuration(millis: number) {
        let minutes = Math.floor(millis / 60000)
        let hours = Math.round(minutes / 60)
        let days = Math.round(hours / 24)

        return (
            'Comentó hace ' + (days && days + (days > 1 ? ' días' : ' día')) ||
            (hours && hours + (hours > 1 ? '  horas' : ' hora')) ||
            minutes + (minutes > 1 ? '  minutos' : ' minuto')
        )
    }

    return (
        <div className="flow-root relative z-0">
            <ul role="list">
                {comments?.reverse().map((comment, commentIdx) => (
                    <li key={commentIdx}>
                        <div className="relative pb-8">
                            {commentIdx !== comments.length - 1 ? (
                                <span
                                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"
                                />
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                                <>
                                    <div className="relative">
                                        <Image
                                            width={100}
                                            height={100}
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
                                            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                                            alt=""
                                        />

                                        <span className="absolute -bottom-0.5 -right-3 rounded-tl bg-white px-0.5 py-px">
                                            <MessageCircle
                                                className="h-5 w-5  text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div>
                                            <div className="text-sm">
                                                Un metodólogo
                                            </div>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {getDuration(
                                                    new Date().getTime() -
                                                        new Date(
                                                            comment.date
                                                        ).getTime()
                                                )}
                                            </p>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-700">
                                            <RTEViewer
                                                title={'Pendiente'}
                                                content={comment.data}
                                            />
                                        </div>
                                    </div>
                                </>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
