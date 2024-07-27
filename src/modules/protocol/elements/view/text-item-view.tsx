import { cx } from '@utils/cx'
import { EmptyStateItem } from './empty-state-item'
import {
  DescriptionDetails,
  DescriptionTerm,
} from '@components/description-list'

interface TextItemProps {
  title: string
  content: string | null
  className?: string
}
const TextItemView = ({ title, content, className }: TextItemProps) => {
  return (
    <>
      <DescriptionTerm>{title}</DescriptionTerm>
      {content ?
        <DescriptionDetails>
          <div
            className={cx(className, 'prose max-w-none text-sm !font-normal')}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </DescriptionDetails>
      : <DescriptionDetails>
          <EmptyStateItem />
        </DescriptionDetails>
      }
    </>
  )
}
export default TextItemView
