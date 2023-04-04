import clsx from 'clsx'
import { EmptyStateItem } from './empty-state-item'

interface TextItemProps {
    title: string
    content: string | null
    className?: string
}
const TextItemView = ({ title, content, className }: TextItemProps) => {
    return (
        <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">{title}</dt>
            {content ? (
                <dd className={clsx(className, 'prose max-w-none text-sm')}>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </dd>
            ) : (
                <EmptyStateItem />
            )}
        </div>
    )
}
export default TextItemView
