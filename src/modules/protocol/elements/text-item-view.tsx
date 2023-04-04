import clsx from 'clsx'
import { EmptyStateItem } from './empty-state-item'

interface TextItemProps {
    title: string
    content: string | null
    rounded?: boolean
}
const TextItemView = ({ title, content, rounded = true }: TextItemProps) => {
    return (
        <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">{title}</dt>
            {content ? (
                <dd
                    className={clsx(
                        { rounded: rounded },
                        'prose max-w-none border px-4'
                    )}
                >
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </dd>
            ) : (
                <EmptyStateItem />
            )}
        </div>
    )
}
export default TextItemView
